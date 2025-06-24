import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Modal, Input, message, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Expense, ApprovalData } from '../types';
import expenseService from '../services/expense.service';
import { EXPENSE_STATUSES, QUERY_KEYS } from '../utils/constants';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';
import { validateApprovalPermission, getApprovalLevelText } from '../utils/approvalHelpers';

const { Title } = Typography;
const { TextArea } = Input;

const PendingApprovals: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [approvalAction, setApprovalAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [remarks, setRemarks] = useState('');

  const { data: pendingApprovalsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PENDING_APPROVALS, currentPage, pageSize],
    queryFn: () => expenseService.getPendingApprovals(currentPage, pageSize),
  });

  const approveExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ApprovalData }) =>
      expenseService.approveExpense(id, data),
    onSuccess: () => {
      message.success(`Expense ${approvalAction.toLowerCase()} successfully!`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_APPROVALS] });
      setApprovalModalVisible(false);
      setSelectedExpense(null);
      setRemarks('');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to process approval';
      message.error(errorMessage);
    },
  });

  const handleApprovalAction = (expense: Expense, action: 'APPROVED' | 'REJECTED') => {
    if (!user?.roles) {
      message.error('User roles not found');
      return;
    }

    // Validate approval permission
    const validation = validateApprovalPermission({
      userRoles: user.roles,
      currentApprovalLevel: expense.current_approval_level,
      statusId: expense.status_id
    });

    if (!validation.canApprove) {
      message.error(validation.reason || 'Cannot approve this expense');
      return;
    }

    setSelectedExpense(expense);
    setApprovalAction(action);
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = () => {
    if (!selectedExpense) return;

    if (approvalAction === 'REJECTED' && !remarks.trim()) {
      message.error('Remarks are required when rejecting an expense');
      return;
    }

    const approvalData: ApprovalData = {
      status: approvalAction,
      remarks: remarks.trim() || undefined,
    };

    approveExpenseMutation.mutate({
      id: selectedExpense.id,
      data: approvalData,
    });
  };

  const handleViewDetails = (expenseId: number) => {
    navigate(`/expense/${expenseId}`);
  };

  const getApprovalLevel = () => {
    if (!user?.roles) return '';
    if (user.roles.includes('MANAGER')) return 'Manager';
    if (user.roles.includes('ACCOUNTANT')) return 'Accountant';
    if (user.roles.includes('ADMIN')) return 'Admin';
    return '';
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
    },
    {
      title: 'Submitted',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => handleApprovalAction(record, 'APPROVED')}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleApprovalAction(record, 'REJECTED')}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];
    const filteredData: Expense[] = pendingApprovalsData?.data || [];
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Pending Approvals</Title>
          <Typography.Text type="secondary">
            Review and approve expenses as {getApprovalLevel()}
          </Typography.Text>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pendingApprovalsData?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} pending approvals`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </Space>

      {/* Approval Modal */}
      <Modal
        title={`${approvalAction === 'APPROVED' ? 'Approve' : 'Reject'} Expense`}
        open={approvalModalVisible}
        onOk={handleApprovalSubmit}
        onCancel={() => {
          setApprovalModalVisible(false);
          setSelectedExpense(null);
          setRemarks('');
        }}
        confirmLoading={approveExpenseMutation.isPending}
        okText={approvalAction === 'APPROVED' ? 'Approve' : 'Reject'}
        okButtonProps={{
          danger: approvalAction === 'REJECTED',
        }}
      >
        {selectedExpense && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Typography.Text strong>Expense Details:</Typography.Text>
              <div style={{ marginTop: 8 }}>
                <Row gutter={[16, 8]}>
                  <Col span={8}><Typography.Text type="secondary">Title:</Typography.Text></Col>
                  <Col span={16}>{selectedExpense.title}</Col>
                  <Col span={8}><Typography.Text type="secondary">Amount:</Typography.Text></Col>
                  <Col span={16}>${selectedExpense?.amount.toFixed(2)}</Col>
                  <Col span={8}><Typography.Text type="secondary">Employee:</Typography.Text></Col>
                  <Col span={16}>{selectedExpense.requester.name}</Col>
                  <Col span={8}><Typography.Text type="secondary">Category:</Typography.Text></Col>
                  <Col span={16}>{selectedExpense.category}</Col>
                </Row>
              </div>
            </div>

            <div>
              <Typography.Text strong>
                Remarks {approvalAction === 'REJECTED' ? '(Required)' : '(Optional)'}:
              </Typography.Text>
              <TextArea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={
                  approvalAction === 'APPROVED'
                    ? 'Add any comments about the approval...'
                    : 'Please provide reason for rejection...'
                }
                style={{ marginTop: 8 }}
              />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default PendingApprovals;
