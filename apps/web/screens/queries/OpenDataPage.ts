import gql from 'graphql-tag'

export const GET_OPEN_DATA_PAGE_QUERY = gql`
query GetOpenDataPage($input: GetOpenDataPageInput!) {
  getOpenDataPage(input: $input) {
    pageTitle
    pageDescription
    pageHeaderGraph {
      title
      type
      data
    }
    link
    linkTitle
    statisticSection {
      id
      title
      cards {
        title
        body
        link
        linkText
      }
    }
    chartSectionTitle
    externalLinkCardSelection {
      id
      title
      cards {
        title
        body
        link
        linkText
      }
    }
  graphCards {
    graphTitle
    graphDescription
    organization
    graph {
      title
      type
      data
    }
  }
  }
}
`
