import {gql} from '@apollo/client';
import {
  addressFragment,
  appraisalFragment,
  unitsOfUseFragment,
} from '../fragments/assets.fragment';

export const GET_SINGLE_PROPERTY_QUERY = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
      propertyNumber
      defaultAddress {
        ...Address
      }
      appraisal {
        ...Appraisal
      }
      unitsOfUse {
        unitsOfUse {
          ...unitsOfUse
        }
      }
    }
  }
  ${unitsOfUseFragment}
  ${appraisalFragment}
  ${addressFragment}
`;
