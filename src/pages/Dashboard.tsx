import React, { use, useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser, selectHasRole, selectHasAnyRole,getNotifications } from '../store/slices/authSlice';
import expenseService from '../services/expense.service';
import { QUERY_KEYS } from '../utils/constants';
import { IExpenseStatus } from '../enum';
// import useNotifications from '../hooks/useNotifications';


const { Title } = Typography;

const Dashboard: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const hasEmployeeRole = useAppSelector(selectHasRole('EMPLOYEE'));
  const hasManagerRole = useAppSelector(selectHasAnyRole(['MANAGER', 'ACCOUNTANT', 'ADMIN']));
  const hasAdminRole = useAppSelector(selectHasRole('ADMIN'));
  // const { requestNotificationPermission } = useNotifications();
  const hasFetchedNotifications = useRef(false);
  const [hasInitialized, setHasInitialized] = useState(false);



  // Fetch dashboard data based on user role
  const { data: myExpenses } = useQuery({
    queryKey: [QUERY_KEYS.MY_EXPENSES],
    queryFn: () => expenseService.getMyExpenses(1, 100),
    enabled: hasEmployeeRole,
  });

  const { data: pendingApprovals } = useQuery({
    queryKey: [QUERY_KEYS.PENDING_APPROVALS],
    queryFn: () => expenseService.getPendingApprovals(1, 100),
    enabled: hasManagerRole,
  });

  const { data: allExpenses } = useQuery({
    queryKey: [QUERY_KEYS.ALL_EXPENSES],
    queryFn: () => expenseService.getAllExpenses(1, 100),
    enabled: hasAdminRole,
  });


  const [notificationsStatus, setNotificationsStatus] = useState('idle'); // 'idle', 'loading', 'loaded', 'error'

  // Calculate statistics
  const getMyExpenseStats = () => {
    if (!myExpenses?.data) return { total: 0, pending: 0, approved: 0, totalAmount: 0 };
    console.log('My Expenses Data:', myExpenses.data);
    const expenses = myExpenses.data;
    return {
      total: expenses.length,
      pending: expenses.filter(e => e.status_id === IExpenseStatus.PENDING).length,
      approved: expenses.filter(e => e.status_id === IExpenseStatus.FULLY_APPROVED).length,
      totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    };
  };

  const getNoticications = () => {
    if (!user) return [];
    const notifications = [];
    dispatch(getNotifications()).unwrap()
      .then(data => {
        console.log('Notifications:', data);
        // notifications.push();
      })
      .catch(error => {
        console.error('Failed to fetch notifications:', error);
      });
  }

  const getPendingApprovalStats = () => {
    if (!pendingApprovals?.data) return { count: 0, totalAmount: 0 };
    
    const expenses = pendingApprovals.data;
    return {
      count: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    };
  };

  const getAllExpenseStats = () => {
    if (!allExpenses?.data) return { total: 0, totalAmount: 0, thisMonth: 0 };
    
    const expenses = allExpenses.data;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return {
      total: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
      thisMonth: expenses.filter(e => {
        const expenseDate = new Date(e.createdAt);
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      }).length,
    };
  };

  const myStats = getMyExpenseStats();
  const pendingStats = getPendingApprovalStats();
  const allStats = getAllExpenseStats();

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Welcome back, {user?.name}!</Title>
          <Typography.Text type="secondary">
            Here's an overview of your expense management dashboard
          </Typography.Text>
        </div>

        {/* Employee Dashboard */}
        {hasEmployeeRole && (
          <div>
            <Title level={4}>My Expenses</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Expenses"
                    value={myStats.total}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Pending"
                    value={myStats.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Approved"
                    value={myStats.approved}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Amount"
                    value={myStats.totalAmount}
                    prefix={<DollarOutlined />}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Manager/Accountant/Admin Dashboard */}
        {hasManagerRole && (
          <div>
            <Title level={4}>Pending Approvals</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Awaiting Approval"
                    value={pendingStats.count}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Amount"
                    value={pendingStats.totalAmount}
                    prefix={<DollarOutlined />}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Admin Dashboard */}
        {hasAdminRole && (
          <div>
            <Title level={4}>System Overview</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Expenses"
                    value={allStats.total}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="This Month"
                    value={allStats.thisMonth}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Value"
                    value={allStats.totalAmount}
                    prefix={<DollarOutlined />}
                    precision={2}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Space>
    </div>
  );
};

export default Dashboard;
