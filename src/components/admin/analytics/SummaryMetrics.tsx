import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';

interface SummaryMetricsProps {
  totalExpenses: number;
  totalAmount: number;
  pendingExpenses: number;
  approvedExpenses: number;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ totalExpenses, totalAmount, pendingExpenses, approvedExpenses }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total Expenses" value={totalExpenses} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total Amount" value={`$${totalAmount?.toFixed(2)}`} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Pending Expenses" value={pendingExpenses} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Approved Expenses" value={approvedExpenses} />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryMetrics;
