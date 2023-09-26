import gql from 'graphql-tag';

export const GET_FINANCE_STATUS_DETAIL = gql`
  query GetFinanceStatusDetailsQuery($input: GetFinancialOverviewInput!) {
    getFinanceStatusDetails(input: $input)
  }
`;
