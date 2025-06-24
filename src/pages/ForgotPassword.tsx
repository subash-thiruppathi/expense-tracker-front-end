import React from 'react';
import { Layout } from 'antd';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const { Content } = Layout;

const ForgotPassword: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: '#f0f2f5' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <ForgotPasswordForm />
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;
