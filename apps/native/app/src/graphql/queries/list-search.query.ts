import { gql } from '@apollo/client';
import { SearchFragment, IArticleSearchResults } from '../fragments/search.fragment';

export const LIST_SEARCH_QUERY = gql`
  query listSearch {
    searchResults(query: {
      queryString: "Umsókn",
      types: webArticle,
      tags: []
    }) {
      total
      items {
        ...SearchFragment
      }
    }
  }
  ${SearchFragment}
`;

export interface ListApplicationsResponse {
  listSearch: {
    total: number;
    items: IArticleSearchResults[];
  }
}
