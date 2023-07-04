import {gql} from '@apollo/client';
import {addressFragment, pagingFragment} from '../fragments/assets.fragment';

export const GET_REAL_ESTATE_QUREY = gql`
  query GetRealEstateQuery($input: GetMultiPropertyInput!) {
    assetsOverview(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          ...Address
        }
      }
      paging {
        ...Paging
      }
    }
  }
  ${pagingFragment}
  ${addressFragment}
`;
