import React from 'react';
import { Layout } from 'antd';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const { Content } = Layout;

const ResetPassword: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: '#f0f2f5' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <ResetPasswordForm />
        </div>
      </Content>
    </Layout>
  );
};

export default ResetPassword;
