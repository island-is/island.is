import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($input: CategoriesInput!) {
    categories(input: $input) {
      title
      slug
      description
    }
  }
`

export const GET_ARTICLES_IN_CATEGORY_QUERY = gql`
  query GetArticlesInCategory($category: ArticlesInCategoryInput!) {
    articlesInCategory(category: $category) {
      content
      category
      slug
      title
      group
      groupDescription
      groupSlug
    }
  }
`
