import {gql} from '@apollo/client';
import {IApplication} from '../fragments/application.fragment';

export const GENERATE_PKPASS_MUTATION = gql`
  mutation generatePkPass($input: GeneratePkPassInput!) {
    generatePkPass(input: $input) {
      pkpassUrl
    }
  }
`;

export interface GeneratePkpassMutationResponse {
  generatePkPass: {
    pkpassUrl: string;
  };
}
