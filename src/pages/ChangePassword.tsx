import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';

const { Content } = Layout;
const { Title } = Typography;

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Layout style={{ backgroundColor: '#f0f2f5' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Change Password</Title>
            </div>
            <ChangePasswordForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default ChangePassword;
