import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, NotificationOutlined, NotificationTwoTone, MailTwoTone } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUser, logout } from '../../store/slices/authSlice';
import { QUERY_KEYS, USER_ROLES } from '../../utils/constants';
import { useQuery } from '@tanstack/react-query';
import expenseService from '../../services/expense.service';
import { console } from 'inspector';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // const { data: notifications } = useQuery({
  //   queryKey: [QUERY_KEYS.NOTIFICATIONS],
  //   queryFn: () => expenseService.getAllExpenses(1, 100),
  //   // enabled: hasAdminRole,
  // });

  // console.log('Notifications:', notifications);

  const handleLogout = () => {
    dispatch(logout());
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? '☰' : '✕'}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Typography.Title level={4} style={{ margin: 0, marginLeft: 16 }}>
          Expense Approval System
        </Typography.Title>
      </div>

      <Space>
        <div style={{ textAlign: 'right',lineHeight: '1.2' }}>
          <Text strong>{user?.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.roles.map(role => USER_ROLES[role]).join(', ')}
          </Text>
        </div>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar
            style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
            icon={<UserOutlined />}
          />
        {/* <div style={{ cursor: 'pointer', color: '#1890ff' ,marginRight:'10px'}}>
          <NotificationTwoTone />
          </div> */}
        </Dropdown>
        <div className='notification-icon' >
          <Avatar
            style={{ backgroundColor: '#fff', cursor: 'pointer' ,fontSize:'22px'}}
            icon={<MailTwoTone />}></Avatar>
        </div>
      </Space>
    </AntHeader>
  );
};

export default Header;
