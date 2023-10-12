import gql from 'graphql-tag';

export const GET_FINANCE_STATUS = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
    getDebtStatus {
      myDebtStatus {
        approvedSchedule
        possibleToSchedule
      }
    }
  }
`;

export interface GetFinanceStatus {
  timestamp: string;
  principalTotals: number;
  interestTotals: number;
  costTotals: number;
  statusTotals: number;
  message: string;
  organizations: Organization[];
  downloadServiceURL: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  homepage: string;
  principalTotals: number;
  interestTotals: number;
  costTotals: number;
  statusTotals: number;
  dueStatusTotals: number;
  chargeTypes: ChargeType[];
}

export interface ChargeType {
  id: string;
  name: string;
  principal: number;
  interest: number;
  cost: number;
  totals: number;
  dueTotals: number;
}
export interface GetDebtStatus {
  myDebtStatus: MyDebtStatus[];
}

export interface MyDebtStatus {
  approvedSchedule: number;
  possibleToSchedule: number;
}
