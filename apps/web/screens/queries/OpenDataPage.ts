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
      statisticsCardsSection {
        title
        statistic
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
      externalLinkSectionTitle
      externalLinkSectionDescription
      externalLinkSectionImage {
        id
        url
        title
        contentType
        width
        height
      }
    }
  }
`
