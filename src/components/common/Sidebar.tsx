import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  PlusOutlined,
  UnorderedListOutlined,
  UserOutlined,
  LockOutlined,
  UsergroupAddOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { selectHasRole, selectHasAnyRole } from '../../store/slices/authSlice';
import { ROUTES } from '../../utils/constants';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasEmployeeRole = useAppSelector(selectHasRole('EMPLOYEE'));
  const hasManagerRole = useAppSelector(selectHasAnyRole(['MANAGER', 'ACCOUNTANT', 'ADMIN']));
  const hasAdminRole = useAppSelector(selectHasRole('ADMIN'));

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: ROUTES.MY_EXPENSES,
      icon: <FileTextOutlined />,
      label: 'My Expenses',
      show: hasEmployeeRole,
    },
    {
      key: '/submit-expense',
      icon: <PlusOutlined />,
      label: 'Submit Expense',
      show: hasEmployeeRole,
    },
    {
      key: ROUTES.PENDING_APPROVALS,
      icon: <CheckCircleOutlined />,
      label: 'Pending Approvals',
      show: hasManagerRole,
    },
    {
      key: ROUTES.ALL_EXPENSES,
      icon: <UnorderedListOutlined />,
      label: 'All Expenses',
      show: hasAdminRole,
    },
    {
      key: '/user-management',
      icon: <UsergroupAddOutlined />,
      label: 'User Management',
      show: hasAdminRole,
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics Dashboard',
      show: hasAdminRole,
    },
    {
      key: '/change-password',
      icon: <LockOutlined />,
      label: 'Change Password',
    },
  ].filter(item => item.show !== false);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {!collapsed ? 'EAS' : 'E'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
