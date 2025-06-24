import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Timeline, 
  Image, 
  Modal,
  Input,
  message,
  Row,
  Col,
  Divider,
  Tabs
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  DownloadOutlined,
  FileImageOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ApprovalData, Expense } from '../types';
import expenseService from '../services/expense.service';
import { EXPENSE_STATUSES, QUERY_KEYS, UPLOAD_URL } from '../utils/constants';
import { useAppSelector } from '../store/hooks';
import { selectHasAnyRole, selectUser } from '../store/slices/authSlice';
import { IExpenseStatus } from '../enum';
import { getStatusKey } from '../utils/UtilFunctions';
import { validateApprovalPermission, getApprovalLevelText } from '../utils/approvalHelpers';
import PDFViewer from '../components/common/PDFViewer';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ExpenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const hasAnyRole = useAppSelector(selectHasAnyRole(['MANAGER', 'ACCOUNTANT', 'ADMIN']));
  const queryClient = useQueryClient();
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [remarks, setRemarks] = useState('');

  const { data: expenseData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_DETAILS, id],
    queryFn: () => expenseService.getExpenseById(Number(id)),
    enabled: !!id,
  });

  const approveExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ApprovalData }) =>
      expenseService.approveExpense(id, data),
    onSuccess: () => {
      message.success(`Expense ${approvalAction.toLowerCase()} successfully!`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSE_DETAILS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_APPROVALS] });
      setApprovalModalVisible(false);
      setRemarks('');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to process approval';
      message.error(errorMessage);
    },
  });

  
  if (!expenseData) {
    return <div>Expense not found</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!expenseData) {
    return <div>Expense not found</div>;
  }
  
  const expense: Expense = expenseData;

  // Helper function to check if the receipt is a PDF
  const isPDF = (filename: string): boolean => {
    return filename.toLowerCase().endsWith('.pdf');
  };

  // Helper function to check if the receipt is an image
  const isImage = (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const handleApprovalAction = (action: 'APPROVED' | 'REJECTED') => {
    console.log(`Handling approval action: ${action}`);
    setApprovalAction(action);
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = () => {
    if (approvalAction === 'REJECTED' && !remarks.trim()) {
      message.error('Remarks are required when rejecting an expense');
      return;
    }

    const approvalData: ApprovalData = {
      status: approvalAction,
      remarks: remarks.trim() || undefined,
    };

    approveExpenseMutation.mutate({
      id: expense.id,
      data: approvalData,
    });
  };

  // Check if user can approve this expense
  const approvalValidation = user?.roles ? validateApprovalPermission({
    userRoles: user.roles,
    currentApprovalLevel: expense.current_approval_level,
    statusId: expense.status_id
  }) : { canApprove: false };

  const canApprove = approvalValidation.canApprove;

    // // const statusConfig = EXPENSE_STATUSES[expense.status_id as unknown as ExpenseStatus];
    // const getStatusKey = (statusId: number): ExpenseStatus => {
    //   switch (statusId) {
    //     case 1: return 'PENDING';
    //     case 2: return 'MANAGER_APPROVED';
    //     case 3: return 'ACCOUNTANT_APPROVED';
    //     case 4: return 'FULLY_APPROVED';
    //     case 5: return 'REJECTED';
    //     default: return 'PENDING';
    //   }
    // };
    
    const statusConfig = EXPENSE_STATUSES[getStatusKey(expense.status_id)];
   
  const timelineItems = [
    {
      color: 'blue',
      children: (
        <div>
          <Text strong>Expense Submitted</Text>
          <br />
          <Text type="secondary">
            by {expense.requester.name} on {dayjs(expense.createdAt).format('MMM DD, YYYY HH:mm')}
          </Text>
        </div>
      ),
    },
    ...expense?.Approvals?.map((approval:any) => ({
      color: approval.status === 'APPROVED' ? 'green' : 'red',
      children: (
        <div>
          <Text strong>
            {approval.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {approval.approver_name}
          </Text>
          <br />
          <Text type="secondary">
            {approval.approver_role} • {dayjs(approval.approved_at).format('MMM DD, YYYY HH:mm')}
          </Text>
          {approval.remarks && (
            <>
              <br />
              <Text italic>"{approval.remarks}"</Text>
            </>
          )}
        </div>
      ),
    })),
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Expense Details
            </Title>
          </Space>
          
          {canApprove && (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprovalAction('APPROVED')}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleApprovalAction('REJECTED')}
              >
                Reject
              </Button>
            </Space>
          )}
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Expense Information">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Title">
                  {expense.title}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    ${expense.amount?.toFixed(2)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  <Tag color="blue">{expense.category}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={statusConfig?.color || 'default'}>
                    {statusConfig?.label || expense.status_id}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Employee">
                  {expense.requester.name} ({expense.requester.email})
                </Descriptions.Item>
                <Descriptions.Item label="Submitted">
                  {dayjs(expense.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {dayjs(expense.updatedAt).format('MMMM DD, YYYY [at] HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {expense.description}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              {expense.receipt_url && (
                <>
                  <Divider />
                  <div>
                    <Title level={4}>Receipt</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {isPDF(expense.receipt_url) ? (
                        <Tabs
                          defaultActiveKey="preview"
                          items={[
                            {
                              key: 'preview',
                              label: (
                                <span>
                                  <FilePdfOutlined />
                                  PDF Preview
                                </span>
                              ),
                              children: (
                                <div>
                                  <PDFViewer 
                                    file={`${UPLOAD_URL}${expense.receipt_url}`}
                                    width={400}
                                    height={600}
                                  />
                                </div>
                              ),
                            },
                            {
                              key: 'download',
                              label: (
                                <span>
                                  <DownloadOutlined />
                                  Download
                                </span>
                              ),
                              children: (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                  <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                                  <div>
                                    <Text strong>PDF Receipt</Text>
                                    <br />
                                    <Text type="secondary">Click the button below to download the PDF receipt</Text>
                                  </div>
                                  <div style={{ marginTop: '20px' }}>
                                    <Button 
                                      type="primary"
                                      size="large"
                                      icon={<DownloadOutlined />}
                                      href={`${UPLOAD_URL}${expense.receipt_url}`}
                                      target="_blank"
                                    >
                                      Download PDF Receipt
                                    </Button>
                                  </div>
                                </div>
                              ),
                            },
                          ]}
                        />
                      ) : isImage(expense.receipt_url) ? (
                        <Tabs
                          defaultActiveKey="preview"
                          items={[
                            {
                              key: 'preview',
                              label: (
                                <span>
                                  <FileImageOutlined />
                                  Image Preview
                                </span>
                              ),
                              children: (
                                <div style={{ textAlign: 'center' }}>
                                  <Image
                                    width={400}
                                    src={`${UPLOAD_URL}${expense.receipt_url}`}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                  />
                                </div>
                              ),
                            },
                            {
                              key: 'download',
                              label: (
                                <span>
                                  <DownloadOutlined />
                                  Download
                                </span>
                              ),
                              children: (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                  <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                  <div>
                                    <Text strong>Image Receipt</Text>
                                    <br />
                                    <Text type="secondary">Click the button below to download the image receipt</Text>
                                  </div>
                                  <div style={{ marginTop: '20px' }}>
                                    <Button 
                                      type="primary"
                                      size="large"
                                      icon={<DownloadOutlined />}
                                      href={`${UPLOAD_URL}${expense.receipt_url}`}
                                      target="_blank"
                                    >
                                      Download Image Receipt
                                    </Button>
                                  </div>
                                </div>
                              ),
                            },
                          ]}
                        />
                      ) : (
                        // Fallback for other file types
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <DownloadOutlined style={{ fontSize: '48px', color: '#8c8c8c', marginBottom: '16px' }} />
                          <div>
                            <Text strong>Receipt File</Text>
                            <br />
                            <Text type="secondary">Preview not available for this file type</Text>
                          </div>
                          <div style={{ marginTop: '20px' }}>
                            <Button 
                              type="primary"
                              size="large"
                              icon={<DownloadOutlined />}
                              href={`${UPLOAD_URL}${expense.receipt_url}`}
                              target="_blank"
                            >
                              Download Receipt
                            </Button>
                          </div>
                        </div>
                      )}
                    </Space>
                  </div>
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Approval Timeline">
              <Timeline items={timelineItems} />
            </Card>
          </Col>
        </Row>
      </Space>

      {/* Approval Modal */}
      <Modal
        title={`${approvalAction === 'APPROVED' ? 'Approve' : 'Reject'} Expense`}
        open={approvalModalVisible}
        onOk={handleApprovalSubmit}
        onCancel={() => {
          setApprovalModalVisible(false);
          setRemarks('');
        }}
        confirmLoading={approveExpenseMutation.isPending}
        okText={approvalAction === 'APPROVED' ? 'Approve' : 'Reject'}
        okButtonProps={{
          danger: approvalAction === 'REJECTED',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>
              Are you sure you want to {approvalAction.toLowerCase()} this expense?
            </Text>
          </div>

          <div>
            <Text strong>
              Remarks {approvalAction === 'REJECTED' ? '(Required)' : '(Optional)'}:
            </Text>
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
      </Modal>
    </div>
  );
};

export default ExpenseDetails;
