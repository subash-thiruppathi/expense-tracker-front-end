import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import authService from '../../services/auth.service';
import { ChangePasswordData } from '../../types';

const { Title, Text } = Typography;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isFirstLogin?: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ 
  onSuccess, 
  onCancel, 
  isFirstLogin = false 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

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

  const onFinish = async (values: ChangePasswordData & { confirm_password: string }) => {
    setLoading(true);
    try {
      const changeData: ChangePasswordData = {
        current_password: values.current_password,
        new_password: values.new_password
      };
      
      const response = await authService.changePassword(changeData);
      message.success(response.message);
      setChangeSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (changeSuccess) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={3}>Password Changed Successfully</Title>
            <Text type="secondary">
              {isFirstLogin 
                ? 'Your password has been set successfully. You can now access the system.'
                : 'Your password has been changed successfully.'
              }
            </Text>
          </div>
        </Space>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>
            {isFirstLogin ? 'Set Your Password' : 'Change Password'}
          </Title>
          <Text type="secondary">
            {isFirstLogin 
              ? 'Please set a new password for your account.'
              : 'Enter your current password and choose a new one.'
            }
          </Text>
        </div>

        <Form
          form={form}
          name="change-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="current_password"
            label={isFirstLogin ? "Temporary Password" : "Current Password"}
            rules={[
              { required: true, message: `Please enter your ${isFirstLogin ? 'temporary' : 'current'} password` }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={`Enter ${isFirstLogin ? 'temporary' : 'current'} password`}
              size="large"
            />
          </Form.Item>

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
              {isFirstLogin ? 'Set Password' : 'Change Password'}
            </Button>
          </Form.Item>

          {!isFirstLogin && onCancel && (
            <Form.Item>
              <Button
                type="default"
                onClick={onCancel}
                size="large"
                block
              >
                Cancel
              </Button>
            </Form.Item>
          )}
        </Form>

        {isFirstLogin && (
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Password must be at least 6 characters long
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ChangePasswordForm;
