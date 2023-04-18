import {gql} from '@apollo/client';

export const SearchFragment = gql`
  fragment SearchFragment on Article {
    id
    title
    slug
    category {
      id
      title
      slug
    }
  }
`;

export interface IArticleSearchResults {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    title: string;
    slub: string;
  };
}
