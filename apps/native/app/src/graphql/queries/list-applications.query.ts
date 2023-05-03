import {gql} from '@apollo/client';
import {
  ApplicationFragment,
  IApplication,
} from '../fragments/application.fragment';

export const LIST_APPLICATIONS_QUERY = gql`
  query listApplications {
    applicationApplications {
      ...ApplicationFragment
    }
  }
  ${ApplicationFragment}
`;

export interface ListApplicationsResponse {
  applicationApplications: IApplication[];
}
