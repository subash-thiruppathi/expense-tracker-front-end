import { UserRole } from '../types';

export interface ApprovalContext {
  userRoles: UserRole[];
  currentApprovalLevel: number;
  statusId: number;
}

export interface ApprovalValidation {
  canApprove: boolean;
  expectedLevel: number;
  approverRole: UserRole | null;
  reason?: string;
}

/**
 * Validates if a user can approve an expense based on their roles and the expense's current state
 */
export const validateApprovalPermission = (context: ApprovalContext): ApprovalValidation => {
  const { userRoles, currentApprovalLevel, statusId } = context;

  // Check if expense is already fully approved or rejected
  if (statusId === 4 || statusId === 5) { // FULLY_APPROVED or REJECTED
    return {
      canApprove: false,
      expectedLevel: 0,
      approverRole: null,
      reason: 'Expense is already finalized'
    };
  }

  // Determine user's highest approval role
  let approverRole: UserRole | null = null;
  let expectedLevel = 0;

  if (userRoles.includes('ADMIN')) {
    approverRole = 'ADMIN';
    expectedLevel = 3;
  } else if (userRoles.includes('ACCOUNTANT')) {
    approverRole = 'ACCOUNTANT';
    expectedLevel = 2;
  } else if (userRoles.includes('MANAGER')) {
    approverRole = 'MANAGER';
    expectedLevel = 1;
  }

  if (!approverRole) {
    return {
      canApprove: false,
      expectedLevel: 0,
      approverRole: null,
      reason: 'User does not have approval permissions'
    };
  }

  // Check if the current approval level matches what this user can approve
  if (currentApprovalLevel !== expectedLevel) {
    return {
      canApprove: false,
      expectedLevel,
      approverRole,
      reason: `Invalid approval sequence. Expected level ${expectedLevel}, current level ${currentApprovalLevel}`
    };
  }

  // Validate status progression
  const validStatusForLevel: Record<number, number[]> = {
    1: [1], // MANAGER can approve PENDING (status_id: 1)
    2: [2], // ACCOUNTANT can approve MANAGER_APPROVED (status_id: 2)
    3: [3], // ADMIN can approve ACCOUNTANT_APPROVED (status_id: 3)
  };

  if (!validStatusForLevel[expectedLevel]?.includes(statusId)) {
    return {
      canApprove: false,
      expectedLevel,
      approverRole,
      reason: `Expense cannot be processed at this level. Current status: ${statusId}`
    };
  }

  return {
    canApprove: true,
    expectedLevel,
    approverRole
  };
};

/**
 * Gets the appropriate approval level text for display
 */
export const getApprovalLevelText = (userRoles: UserRole[]): string => {
  if (userRoles.includes('ADMIN')) return 'Admin';
  if (userRoles.includes('ACCOUNTANT')) return 'Accountant';
  if (userRoles.includes('MANAGER')) return 'Manager';
  return '';
};
