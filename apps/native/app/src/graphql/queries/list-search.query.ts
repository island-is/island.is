import {gql} from '@apollo/client';
import {
  SearchFragment,
  IArticleSearchResults,
} from '../fragments/search.fragment';

export const LIST_SEARCH_QUERY = gql`
  query listSearch($input: SearcherInput!) {
    searchResults(query: $input) {
      total
      items {
        ...SearchFragment
      }
    }
  }
  ${SearchFragment}
`;

export interface ListApplicationsResponse {
  searchResults: {
    total: number;
    items: IArticleSearchResults[];
  };
}
