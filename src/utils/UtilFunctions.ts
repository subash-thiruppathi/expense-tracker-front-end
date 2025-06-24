import { ExpenseStatus } from "../types";




export const getStatusKey = (statusId: number): ExpenseStatus => {
    switch (statusId) {
        case 1: return 'PENDING';
        case 2: return 'MANAGER_APPROVED';
        case 3: return 'ACCOUNTANT_APPROVED';
        case 4: return 'FULLY_APPROVED';
        case 5: return 'REJECTED';
        default: return 'PENDING';
    }
};
