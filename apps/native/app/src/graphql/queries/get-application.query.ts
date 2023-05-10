import {gql} from '@apollo/client';
import {
  ApplicationFragment,
  IApplication,
} from '../fragments/application.fragment';

export const GET_APPLICATION_QUERY = gql`
  query getApplication($input: ApplicationApplicationInput!) {
    applicationApplication(input: $input) {
      ...ApplicationFragment
    }
  }
  ${ApplicationFragment}
`;

export interface GetDocumentResponse {
  applicationApplication?: IApplication;
}
