import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Input, Select, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Expense } from '../types';
import expenseService from '../services/expense.service';
import { EXPENSE_STATUSES, EXPENSE_CATEGORIES, QUERY_KEYS } from '../utils/constants';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const MyExpenses: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: expensesData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MY_EXPENSES, currentPage, pageSize],
    queryFn: () => expenseService.getMyExpenses(currentPage, pageSize),
  });
  console.log('Expenses Data:', expensesData);
  const handleViewDetails = (expenseId: number) => {
    navigate(`/expense/${expenseId}`);
  };

  const columns: ColumnsType<Expense> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.title.toLowerCase().includes((value as string).toLowerCase()) ||
        record.description.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount?.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filteredValue: categoryFilter ? [categoryFilter] : null,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Status',
      dataIndex: 'status_id',
      key: 'status_id',
      render: (status_id: number) => {
        const statusMap: Record<number, keyof typeof EXPENSE_STATUSES> = {
          1: 'PENDING',
          2: 'MANAGER_APPROVED', 
          3: 'ACCOUNTANT_APPROVED',
          4: 'FULLY_APPROVED',
          5: 'REJECTED'
        };
        const statusKey = statusMap[status_id];
        const statusConfig = statusKey ? EXPENSE_STATUSES[statusKey] : null;
        return (
          <Tag color={statusConfig?.color || 'default'}>
            {statusConfig?.label || `Status ${status_id}`}
          </Tag>
        );
      },
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value, record) => record.status_id.toString() === value,
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      filteredValue: dateRange ? dateRange.map(d => d?.format('YYYY-MM-DD') || '') : null,
      onFilter: (value, record) => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
        const recordDate = dayjs(record.createdAt);
        return recordDate.isAfter(dateRange[0]) && recordDate.isBefore(dateRange[1]);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];
  // const expense: Expense = expenseData;
  const filteredData: Expense[] = expensesData?.data || [];
  console.log('Filtered Data:', filteredData);

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>My Expenses</Title>
            <Typography.Text type="secondary">
              View and manage your submitted expenses
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/submit-expense')}
            size="large"
          >
            Submit New Expense
          </Button>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Search expenses..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Filter by status"
                  style={{ width: '100%' }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                >
                  {Object.entries(EXPENSE_STATUSES).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Filter by category"
                  style={{ width: '100%' }}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  allowClear
                >
                  {EXPENSE_CATEGORIES.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={setDateRange}
                  format="MMM DD, YYYY"
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: expensesData?.total || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} expenses`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 10);
                },
              }}
              scroll={{ x: 800 }}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default MyExpenses;
