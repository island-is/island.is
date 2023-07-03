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
