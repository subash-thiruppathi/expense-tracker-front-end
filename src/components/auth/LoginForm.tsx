import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, selectAuthLoading } from '../../store/slices/authSlice';
import { LoginCredentials } from '../../types';
import { ROUTES } from '../../utils/constants';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const onFinish = async (values: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      console.log('Login successful:', result);
      if (result) {
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
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
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to your expense approval account
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
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
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/forgot-password">
                <Button type="link" style={{ padding: 0 }}>
                  Forgot your password?
                </Button>
              </Link>
            </div>
          </Form>

          {/* <Divider>
            <Text type="secondary">New to the platform?</Text>
          </Divider> */}

          {/* <div style={{ textAlign: 'center' }}>
            <Link to={ROUTES.REGISTER}>
              <Button type="link" style={{ padding: 0 }}>
                Create an account
              </Button>
            </Link>
          </div> */}
        </Space>
      </Card>
    </div>
  );
};

export default LoginForm;
