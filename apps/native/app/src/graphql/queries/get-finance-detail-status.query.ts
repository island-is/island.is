import gql from 'graphql-tag';

export const GET_FINANCE_STATUS_DETAILS = gql`
  query GetFinanceStatusDetailsQuery($input: GetFinancialOverviewInput!) {
    getFinanceStatusDetails(input: $input)
  }
`;

export interface GetFinanceStatusDetails {
  timestamp: string;
  chargeItemSubjects: ChargeItemSubject[];
}

export interface ChargeItemSubject {
  chargeItemSubject: string;
  timePeriod: string;
  estimate: boolean;
  dueDate: string;
  finalDueDate: string;
  principal: number;
  interest: number;
  cost: number;
  paid: number;
  totals: number;
  dueTotals: number;
  documentID: string;
  payID: string;
}
