import React from 'react';
import { Card, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface TopSpenderProps {
  id: number;
  name: string;
  total_spent: number;
}

interface TopSpendersListProps {
  data: TopSpenderProps[];
}

const TopSpendersList: React.FC<TopSpendersListProps> = ({ data }) => {
  return (
    <Card title="Top 10 Spenders" className="h-full">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.name}
              description={`Total Spent: $${item.total_spent?.toFixed(2)}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopSpendersList;
