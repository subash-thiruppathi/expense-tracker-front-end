import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  message, 
  Space, 
  Select, 
  Modal,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  UserAddOutlined, 
  MailOutlined, 
  UserOutlined, 
  CopyOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import authService from '../../services/auth.service';
import { OnboardUserData, OnboardUserResponse, UserRole } from '../../types';
import { USER_ROLES } from '../../utils/constants';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface UserOnboardingFormProps {
  onSuccess?: (user: OnboardUserResponse['user']) => void;
  onCancel?: () => void;
}

const UserOnboardingForm: React.FC<UserOnboardingFormProps> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [onboardedUser, setOnboardedUser] = useState<OnboardUserResponse['user'] | null>(null);
  const [credentialsModalVisible, setCredentialsModalVisible] = useState(false);

  const onFinish = async (values: OnboardUserData) => {
    setLoading(true);
    try {
      const response = await authService.onboardUser(values);
      message.success(response.message);
      setOnboardedUser(response.user);
      setCredentialsModalVisible(true);
      form.resetFields();
      
      // Don't call onSuccess immediately to prevent page reload
      // The modal will handle the success state
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to onboard user';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${label} copied to clipboard`);
    }).catch(() => {
      message.error('Failed to copy to clipboard');
    });
  };

  const handleCredentialsModalClose = () => {
    setCredentialsModalVisible(false);
    
    // Call onSuccess when modal is closed to refresh the user list
    if (onSuccess && onboardedUser) {
      onSuccess(onboardedUser);
    }
    
    setOnboardedUser(null);
  };

  return (
    <>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <UserAddOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={3}>Onboard New User</Title>
            <Text type="secondary">
              Add a new user to the system with their roles and permissions.
            </Text>
          </div>

          <Form
            form={form}
            name="user-onboarding"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: 'Please enter the user\'s full name' },
                    { min: 2, message: 'Name must be at least 2 characters long' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter full name"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter the user\'s email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter email address"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="roles"
              label="User Roles"
              rules={[
                { required: true, message: 'Please select at least one role' }
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select user roles"
                size="large"
                optionLabelProp="label"
              >
                {Object.entries(USER_ROLES).map(([key, label]) => (
                  <Option key={key} value={key} label={label}>
                    <Space>
                      <span>{label}</span>
                      <Text type="secondary">({key})</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider />

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    icon={<UserAddOutlined />}
                  >
                    Onboard User
                  </Button>
                </Form.Item>
              </Col>

              {onCancel && (
                <Col xs={24} md={12}>
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
                </Col>
              )}
            </Row>
          </Form>

          <div style={{ backgroundColor: '#f6f8fa', padding: '16px', borderRadius: '6px' }}>
            <Title level={5}>Important Notes:</Title>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>A temporary password will be generated automatically</li>
              <li>The user will be required to change their password on first login</li>
              <li>User credentials will be displayed after successful onboarding</li>
              <li>Make sure to securely share the credentials with the user</li>
            </ul>
          </div>
        </Space>
      </Card>

      {/* Credentials Display Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            User Onboarded Successfully
          </Space>
        }
        open={credentialsModalVisible}
        onCancel={handleCredentialsModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleCredentialsModalClose}>
            Close
          </Button>
        ]}
        width={600}
      >
        {onboardedUser && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">
                The user has been successfully onboarded. Please share these credentials securely:
              </Text>
            </div>

            <Card size="small" style={{ backgroundColor: '#f6f8fa' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <Text strong>Name:</Text>
                  </Col>
                  <Col span={14}>
                    <Text>{onboardedUser.name}</Text>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(onboardedUser.name, 'Name')}
                    />
                  </Col>
                </Row>

                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <Text strong>Email:</Text>
                  </Col>
                  <Col span={14}>
                    <Text>{onboardedUser.email}</Text>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(onboardedUser.email, 'Email')}
                    />
                  </Col>
                </Row>

                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <Text strong>Temporary Password:</Text>
                  </Col>
                  <Col span={14}>
                    <Text code style={{ backgroundColor: '#fff2f0', color: '#cf1322' }}>
                      {onboardedUser.temporary_password}
                    </Text>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(onboardedUser.temporary_password, 'Password')}
                    />
                  </Col>
                </Row>

                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <Text strong>Roles:</Text>
                  </Col>
                  <Col span={18}>
                    <Space wrap>
                      {onboardedUser.roles.map(role => (
                        <Text key={role} code>{role}</Text>
                      ))}
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Card>

            <div style={{ backgroundColor: '#fff7e6', padding: '12px', borderRadius: '6px', border: '1px solid #ffd591' }}>
              <Text strong style={{ color: '#d46b08' }}>Security Reminder:</Text>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#d46b08' }}>
                <li>Share these credentials through a secure channel</li>
                <li>The user must change their password on first login</li>
                <li>Do not store these credentials in plain text</li>
              </ul>
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default UserOnboardingForm;
