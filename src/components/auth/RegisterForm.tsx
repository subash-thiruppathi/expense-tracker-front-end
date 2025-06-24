import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, selectAuthLoading } from '../../store/slices/authSlice';
import { RegisterData } from '../../types';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterData) => {
    try {
      const result = await dispatch(registerUser(values)).unwrap();
      if (result) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error) {
      // Error is handled in Redux slice with toast
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Create Account
            </Title>
            <Text type="secondary">
              Join the expense approval system
            </Text>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="roles"
              rules={[
                { required: true, message: 'Please select at least one role!' },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select your roles"
                style={{ width: '100%' }}
              >
                {Object.entries(USER_ROLES).map(([key, label]) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">Already have an account?</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Link to={ROUTES.LOGIN}>
              <Button type="link" style={{ padding: 0 }}>
                Sign in instead
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default RegisterForm;
