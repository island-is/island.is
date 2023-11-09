import gql from 'graphql-tag'

export const GET_OPEN_DATA_PAGE_QUERY = gql`
  query GetOpenDataPage($input: GetOpenDataPageInput!) {
    getOpenDataPage(input: $input) {
      pageTitle
      pageDescription
      pageHeaderGraph {
        graphTitle
        type
        data
        datakeys
        displayAsCard
      }
      link
      linkTitle
      statisticsCardsSection {
        title
        statistic
        image {
          id
          url
          title
          contentType
          width
          height
        }
      }
      chartSectionTitle
      externalLinkCardSelection {
        id
        title
        cards {
          id
          title
          body
          linkUrl
          linkText
        }
      }
      graphCards {
        graphTitle
        graphDescription
        organization
        organizationLogo {
          id
          url
          title
          contentType
          width
          height
        }
        type
        data
        datakeys
        displayAsCard
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
