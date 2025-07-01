import React from 'react';
import { Card, List } from 'antd';

interface ApprovalTimeProps {
  expense_id: number;
  avg_approval_time: string;
}

interface ApprovalTimesProps {
  data: ApprovalTimeProps[];
}

const ApprovalTimes: React.FC<ApprovalTimesProps> = ({ data }) => {
  return (
    <Card title="Average Approval Times" className="h-full">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Expense ID: ${item.expense_id}`}
              description={`Average Approval Time: ${item.avg_approval_time}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ApprovalTimes;
