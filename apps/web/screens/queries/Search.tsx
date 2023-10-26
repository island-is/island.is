import gql from 'graphql-tag'

export const GET_SEARCH_RESULTS_QUERY = gql`
  query GetSearchResults($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on Article {
          id
          title
          slug
        }
        ... on LifeEventPage {
          id
          title
          slug
          pageType
        }
        ... on News {
          id
          title
          slug
        }
        ... on SubArticle {
          id
          title
          slug
        }
        ... on ProjectPage {
          id
          title
          slug
        }
        ... on OrganizationPage {
          id
          title
          slug
        }
        ... on OrganizationSubpage {
          id
          title
          slug
          organizationPage {
            slug
          }
        }
      }
    }
  }
`

export const GET_SEARCH_COUNT_QUERY = gql`
  query GetSearchCountTags($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      tagCounts {
        key
        value
        count
        type
      }
      typesCount {
        key
        count
      }
      processEntryCount
    }
  }
`

export const GET_SEARCH_RESULTS_NEWS_QUERY = gql`
  query GetSearchResultsNews($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on News {
          id
          intro
          title
          slug
        }
      }
    }
  }
`

export const GET_SEARCH_RESULTS_TOTAL = gql`
  query GetSearchResultsTotal($query: SearcherInput!) {
    searchResults(query: $query) {
      total
    }
  }
`

export const GET_SEARCH_AUTOCOMPLETE_TERM_QUERY = gql`
  query AutocompleteTermResults($input: WebSearchAutocompleteInput!) {
    webSearchAutocomplete(input: $input) {
      completions
    }
  }
`

export const GET_SEARCH_RESULTS_QUERY_DETAILED = gql`
  query GetSearchResultsDetailed($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on Article {
          id
          title
          slug
          intro
          body {
            ... on ProcessEntry {
              __typename
              processTitle
              processLink
            }
          }
          processEntry {
            id
          }
          group {
            title
          }
          category {
            id
            slug
            title
          }
          organization {
            id
            title
            description
            slug
          }
          subArticles {
            title
            slug
          }
          processEntry {
            id
            processTitle
          }
        }

        ... on LifeEventPage {
          id
          title
          slug
          intro
          category {
            id
            slug
            title
          }
          image {
            id
            url
            title
            contentType
            width
            height
          }
          thumbnail {
            id
            url
            title
            contentType
            width
            height
          }
          pageType
        }

        ... on News {
          id
          intro
          title
          slug
        }

        ... on AdgerdirPage {
          title
          description
          slug
        }

        ... on SubArticle {
          id
          title
          slug
          parent {
            id
            slug
            title
            intro
            group {
              title
            }
            organization {
              id
              title
              description
              slug
            }
            category {
              id
              slug
              title
            }
          }
        }
        ... on OrganizationSubpage {
          id
          title
          url
          intro
          organizationPage {
            organization {
              title
            }
          }
        }
        ... on OrganizationPage {
          id
          title
          slug
          singleOrganization: organization {
            logo {
              id
              url
              title
              contentType
              width
              height
            }
          }
        }
        ... on ProjectPage {
          id
          title
          slug
          subtitle
        }

        ... on Link {
          id
          title: text
          slug: url
          intro
          labels
        }

        ... on Manual {
          title
          slug
        }
      }
      tagCounts {
        key
        value
        count
      }
      typesCount {
        key
        count
      }
      processEntryCount
    }
  }
`
