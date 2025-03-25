import gql from 'graphql-tag'

export const GET_BLOOD_DONATION_RESTRICTIONS_QUERY = gql`
  query GetBloodDonationRestrictions(
    $input: GetBloodDonationRestrictionsInput!
  ) {
    getBloodDonationRestrictions(input: $input) {
      total
      items {
        id
        title
        cardText
        description
      }
    }
  }
`
