import gql from 'graphql-tag'

export const GET_OPEN_DATA_SUBPAGE_QUERY = gql`
  query GetOpenDataSubpage($input: GetOpenDataSubpageInput!) {
    getOpenDataSubpage(input: $input) {
      pageTitle
      fundTitle
      fundDescription
      statisticsCards {
        title
        statistic
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
      organizationLogo {
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
