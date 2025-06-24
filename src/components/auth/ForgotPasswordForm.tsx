import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import { PasswordResetRequest } from '../../types';

const { Title, Text } = Typography;

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const onFinish = async (values: PasswordResetRequest) => {
    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(values);
      message.success(response.message);
      setEmailSent(true);
      setSentEmail(values.email);
      
      // In development, show the reset token
      if (response.reset_token) {
        message.info(`Development Mode - Reset Token: ${response.reset_token}`, 10);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send password reset email';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (sentEmail) {
      setLoading(true);
      try {
        const response = await authService.requestPasswordReset({ email: sentEmail });
        message.success('Password reset email sent again');
        
        // In development, show the reset token
        if (response.reset_token) {
          message.info(`Development Mode - Reset Token: ${response.reset_token}`, 10);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to resend email';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <MailOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={3}>Check Your Email</Title>
            <Text type="secondary">
              We've sent a password reset link to <strong>{sentEmail}</strong>
            </Text>
          </div>
          
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Didn't receive the email? Check your spam folder or
            </Text>
            <Button 
              type="link" 
              onClick={handleResendEmail}
              loading={loading}
              style={{ padding: 0 }}
            >
              Resend Email
            </Button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link to="/login">
              <Button icon={<ArrowLeftOutlined />}>
                Back to Login
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
          <Title level={3}>Forgot Password?</Title>
          <Text type="secondary">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </div>

        <Form
          form={form}
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email address"
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
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              Back to Login
            </Button>
          </Link>
        </div>
      </Space>
    </Card>
  );
};

export default ForgotPasswordForm;
