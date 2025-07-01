import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Input, Select, DatePicker, Row, Col } from 'antd';
import { EyeOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Expense } from '../types';
import expenseService from '../services/expense.service';
import { EXPENSE_STATUSES, EXPENSE_CATEGORIES, QUERY_KEYS } from '../utils/constants';
import { IExpenseStatus } from '../enum';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AllExpenses: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: expensesData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ALL_EXPENSES, currentPage, pageSize],
    queryFn: () => expenseService.getAllExpenses(currentPage, pageSize),
  });

  const handleViewDetails = (expenseId: number) => {
    navigate(`/expense/${expenseId}`);
  };

  const handleExport = () => {
    // This would typically trigger a CSV/Excel export
    console.log('Export functionality would be implemented here');
  };

  const columns: ColumnsType<Expense> = [
    {
      title: 'Employee',
      dataIndex: 'requester',
      render: (_, record) => record.requester?.name ?? '-',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
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
      onFilter: (value, record) => record.status_id === value,
    },
    {
      title: 'Submitted',
      dataIndex: 'created_at',
      key: 'created_at',
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
      title: 'Last Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
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

  const filteredData = expensesData?.data || [];

  // Calculate summary statistics
  const totalExpenses = filteredData.length;
  const totalAmount = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredData.filter(e => e.status_id === IExpenseStatus.PENDING).length;
  const pendingExpenses = filteredData.filter(e => 
    [IExpenseStatus.PENDING, IExpenseStatus.MANAGER_APPROVED, IExpenseStatus.FULLY_APPROVED].includes(e.status_id)
  ).length;

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>All Expenses</Title>
            <Typography.Text type="secondary">
              System-wide expense management and oversight
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="large"
          >
            Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  {totalExpenses}
                </Typography.Title>
                <Typography.Text type="secondary">Total Expenses</Typography.Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  ${totalAmount.toFixed(2)}
                </Typography.Title>
                <Typography.Text type="secondary">Total Amount</Typography.Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  {approvedExpenses}
                </Typography.Title>
                <Typography.Text type="secondary">Approved</Typography.Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0, color: '#faad14' }}>
                  {pendingExpenses}
                </Typography.Title>
                <Typography.Text type="secondary">Pending</Typography.Text>
              </div>
            </Card>
          </Col>
        </Row>

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
              scroll={{ x: 1000 }}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default AllExpenses;
