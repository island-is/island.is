import gql from 'graphql-tag'

import { htmlFields } from './fragments'

export const GET_BLOOD_DONATION_RESTRICTIONS_QUERY = gql`
  query GetBloodDonationRestrictions(
    $input: GetBloodDonationRestrictionsInput!
  ) {
    getBloodDonationRestrictions(input: $input) {
      total
      items {
        id
        title
        cardText {
          ...HtmlFields
        }
        description
        hasDetailedText
      }
    }
  }
  ${htmlFields}
`

export const GET_BLOOD_DONATION_RESTRICTION_DETAILS_QUERY = gql`
  query GetBloodDonationRestrictionDetails(
    $input: GetBloodDonationRestrictionDetailsInput!
  ) {
    getBloodDonationRestrictionDetails(input: $input) {
      id
      title
      cardText {
        ...HtmlFields
      }
      description
      hasDetailedText
      detailedText {
        ...HtmlFields
      }
    }
  }
  ${htmlFields}
`
