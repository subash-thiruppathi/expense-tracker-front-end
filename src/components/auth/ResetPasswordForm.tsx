import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import { ResetPasswordData } from '../../types';

const { Title, Text } = Typography;

const ResetPasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please enter your new password'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('Password must be at least 6 characters long'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please confirm your password'));
    }
    if (value !== form.getFieldValue('new_password')) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  const onFinish = async (values: { new_password: string; confirm_password: string }) => {
    if (!token) {
      message.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    try {
      const resetData: ResetPasswordData = {
        token,
        new_password: values.new_password
      };
      
      const response = await authService.resetPassword(resetData);
      message.success(response.message);
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title level={3}>Invalid Reset Link</Title>
            <Text type="secondary">
              This password reset link is invalid or has expired.
            </Text>
          </div>
          
          <div>
            <Link to="/forgot-password">
              <Button type="primary">
                Request New Reset Link
              </Button>
            </Link>
          </div>
          
          <div>
            <Link to="/login">
              <Button type="link">
                Back to Login
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={3}>Password Reset Successful</Title>
            <Text type="secondary">
              Your password has been successfully reset. You will be redirected to the login page in a few seconds.
            </Text>
          </div>
          
          <div>
            <Link to="/login">
              <Button type="primary">
                Go to Login
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Reset Your Password</Title>
          <Text type="secondary">
            Enter your new password below.
          </Text>
        </div>

        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm New Password"
            rules={[{ validator: validateConfirmPassword }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">
            <Button type="link">
              Back to Login
            </Button>
          </Link>
        </div>
      </Space>
    </Card>
  );
};

export default ResetPasswordForm;
