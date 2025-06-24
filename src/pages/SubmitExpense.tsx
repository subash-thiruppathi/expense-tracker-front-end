import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Card, Typography, Space } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createExpense, selectExpensesLoading } from '../store/slices/expenseSlice';
import { showToast } from '../store/slices/uiSlice';
import { ExpenseFormData } from '../types';
import { EXPENSE_CATEGORIES, ROUTES, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/constants';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const SubmitExpense: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectExpensesLoading);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const formData: ExpenseFormData = {
      title: values.title,
      amount: values.amount,
      description: values.description,
      category: values.category,
      receipt: fileList[0]?.originFileObj,
    };

    try {
      await dispatch(createExpense(formData)).unwrap();
      navigate(ROUTES.MY_EXPENSES);
    } catch (error) {
      // Error is handled in Redux slice with toast
    }
  };

  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
    if (!isValidType) {
      dispatch(showToast({ message: 'You can only upload JPG, PNG, GIF, or PDF files!', type: 'error' }));
      return false;
    }

    const isValidSize = file.size <= MAX_FILE_SIZE;
    if (!isValidSize) {
      dispatch(showToast({ message: 'File must be smaller than 5MB!', type: 'error' }));
      return false;
    }

    return false; // Prevent automatic upload
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Submit New Expense</Title>
          <Typography.Text type="secondary">
            Fill out the form below to submit a new expense for approval
          </Typography.Text>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="title"
              label="Expense Title"
              rules={[
                { required: true, message: 'Please enter expense title!' },
                { min: 3, message: 'Title must be at least 3 characters!' },
              ]}
            >
              <Input placeholder="Enter expense title (e.g., Business Lunch with Client)" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                { required: true, message: 'Please enter amount!' },
                { type: 'number', min: 0.01, message: 'Amount must be greater than 0!' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                precision={2}
                min={0.01}
                prefix="$"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select expense category">
                {EXPENSE_CATEGORIES.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter description!' },
                { min: 10, message: 'Description must be at least 10 characters!' },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Provide detailed description of the expense, including purpose and business justification"
              />
            </Form.Item>

            <Form.Item
              name="receipt"
              label="Receipt (Optional)"
              extra="Upload receipt or supporting document (JPG, PNG, GIF, PDF - Max 5MB)"
            >
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.gif,.pdf"
              >
                <Button icon={<UploadOutlined />}>
                  Click to Upload Receipt
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Submit Expense
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate(ROUTES.MY_EXPENSES)}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default SubmitExpense;
