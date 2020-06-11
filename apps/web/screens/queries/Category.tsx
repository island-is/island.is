import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($input: CategoriesInput!) {
    getCategories(input: $input) {
      title
      slug
    }
  }
`

export const GET_ARTICLES_IN_CATEGORY_QUERY = gql`
  query GetCategories($category: ArticlesInCategoryInput!) {
    getArticlesInCategory(category: $category) {
      content
      category
      slug
      title
    }
  }
`
