import {gql} from '@apollo/client';

export const UPDATE_ISLYKILL_DELETE_INPUT = gql`
  mutation deleteIslykillValue($input: DeleteIslykillValueInput!) {
    deleteIslykillValue(input: $input) {
      nationalId
    }
  }
`;
