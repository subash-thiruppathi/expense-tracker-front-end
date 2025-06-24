import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Table, 
  Tag, 
  Modal, 
  message,
  Row,
  Col,
  Tabs
} from 'antd';
import { UserAddOutlined, UsergroupAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import authService from '../services/auth.service';
import UserOnboardingForm from '../components/admin/UserOnboardingForm';
import { User, UserRole } from '../types';
import { USER_ROLES } from '../utils/constants';
import { useAppSelector } from '../store/hooks';
import { selectHasRole } from '../store/slices/authSlice';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserManagement: React.FC = () => {
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const isAdmin = useAppSelector(selectHasRole('ADMIN'));

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => authService.getAllUsers(),
    enabled: isAdmin,
  });

  const handleOnboardingSuccess = () => {
    // Don't show success message here as it's already shown in the form
    // Don't close modal here as it will be handled by the form's credential modal
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  console.log('Users:', users);

  const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      EMPLOYEE: 'blue',
      MANAGER: 'green',
      ACCOUNTANT: 'orange',
      ADMIN: 'red'
    };
    return colors[role] || 'default';
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: UserRole[]) => (
        <Space wrap>
          {roles.map(role => (
            <Tag key={role} color={getRoleColor(role)}>
              {USER_ROLES[role]}
            </Tag>
          ))}
        </Space>
      ),
      filters: Object.entries(USER_ROLES).map(([key, label]) => ({
        text: label,
        value: key,
      })),
      onFilter: (value, record) => record.roles.includes(value as UserRole),
    },
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
  ];

  if (!isAdmin) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={3}>Access Denied</Title>
          <Text type="secondary">
            You don't have permission to access user management.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>User Management</Title>
            <Text type="secondary">
              Manage users, roles, and permissions in the system.
            </Text>
          </div>
          
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setOnboardingModalVisible(true)}
            >
              Onboard User
            </Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="users" size="large">
          <TabPane 
            tab={
              <span>
                <UsergroupAddOutlined />
                All Users
              </span>
            } 
            key="users"
          >
            <Card>
              <div style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Text type="secondary">Total Users</Text>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                        {users?.length || 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Text type="secondary">Admins</Text>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                        {users?.filter(user => user.roles.includes('ADMIN')).length || 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Text type="secondary">Managers</Text>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {users?.filter(user => user.roles.includes('MANAGER')).length || 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Text type="secondary">Employees</Text>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                        {users?.filter(user => user.roles.includes('EMPLOYEE')).length || 0}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>

              <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={isLoading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} users`,
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <UserAddOutlined />
                Onboard User
              </span>
            } 
            key="onboard"
          >
            <UserOnboardingForm onSuccess={handleOnboardingSuccess} />
          </TabPane>
        </Tabs>
      </Space>

      {/* Onboarding Modal */}
      <Modal
        title="Onboard New User"
        open={onboardingModalVisible}
        onCancel={() => setOnboardingModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <UserOnboardingForm 
          onSuccess={handleOnboardingSuccess}
          onCancel={() => setOnboardingModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
