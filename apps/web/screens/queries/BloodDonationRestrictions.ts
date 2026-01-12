import gql from 'graphql-tag'

import { htmlFields } from './fragments'

export const GET_BLOOD_DONATION_RESTRICTION_GENERIC_TAGS_QUERY = gql`
  query GetBloodDonationRestrictionGenericTags(
    $input: GetBloodDonationRestrictionGenericTagsInput!
  ) {
    getBloodDonationRestrictionGenericTags(input: $input) {
      total
      items {
        key
        label
      }
    }
  }
`
export const GET_BLOOD_DONATION_RESTRICTIONS_QUERY = gql`
  query GetBloodDonationRestrictions(
    $input: GetBloodDonationRestrictionsInput!
  ) {
    getBloodDonationRestrictions(input: $input) {
      total
      input {
        page
        queryString
        tagKeys
        lang
      }
      items {
        id
        title
        hasCardText
        cardText {
          ...HtmlFields
        }
        description
        hasDetailedText
        keywordsText
        effectiveDate
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
      hasCardText
      hasDetailedText
      detailedText {
        ...HtmlFields
      }
      keywordsText
      effectiveDate
    }
  }
  ${htmlFields}
`
