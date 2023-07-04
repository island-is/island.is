import {gql} from '@apollo/client';
import {OrganizationFragment} from '../fragments/organization.fragment';

export const GET_ORGANIZATIONS_QUERY = gql`
  query getOrganizations {
    getOrganizations(input: {lang: "is-IS", perPage: 200}) {
      items {
        ...OrganizationFragment
      }
    }
  }
  ${OrganizationFragment}
`;
