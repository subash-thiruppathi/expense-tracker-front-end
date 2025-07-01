import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAnalyticsSummary,
  fetchExpensesByCategory,
  fetchExpensesByStatus,
  fetchApprovalTimes,
  fetchTopSpenders,
  selectAnalyticsSummary,
  selectExpensesByCategory,
  selectExpensesByStatus,
  selectApprovalTimes,
  selectTopSpenders,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from '../../store/slices/analyticsSlice';
import { Spin, Alert } from 'antd';
import SummaryMetrics from './analytics/SummaryMetrics';
import ExpensesByCategoryChart from './analytics/ExpensesByCategoryChart';
import ExpensesByStatusChart from './analytics/ExpensesByStatusChart';
import ApprovalTimes from './analytics/ApprovalTimes';
import TopSpendersList from './analytics/TopSpendersList';

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectAnalyticsSummary);
  const expensesByCategory = useAppSelector(selectExpensesByCategory);
  const expensesByStatus = useAppSelector(selectExpensesByStatus);
  const approvalTimes = useAppSelector(selectApprovalTimes);
  const topSpenders = useAppSelector(selectTopSpenders);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(fetchAnalyticsSummary());
    dispatch(fetchExpensesByCategory());
    dispatch(fetchExpensesByStatus());
    dispatch(fetchApprovalTimes());
    // dispatch(fetchTopSpenders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="my-4"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Summary Metrics */}
      <div className="col-span-full">
        {summary && <SummaryMetrics {...summary} />}
      </div>

      {/* Expenses by Category */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Expenses by Category</h2>
        {expensesByCategory && <ExpensesByCategoryChart data={expensesByCategory} />}
      </div>

      {/* Expenses by Status */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Expenses by Status</h2>
        {expensesByStatus && <ExpensesByStatusChart data={expensesByStatus} />}
      </div>

      {/* Approval Times */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Approval Times</h2>
        {approvalTimes && <ApprovalTimes data={approvalTimes} />}
      </div>

      {/* Top Spenders */}
      {/* <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Top Spenders</h2>
        {topSpenders && <TopSpendersList data={topSpenders} />}
      </div> */}
    </div>
  );
};

export default AnalyticsDashboard;