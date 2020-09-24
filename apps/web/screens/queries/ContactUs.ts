import gql from 'graphql-tag'

export const CONTACT_US_MUTATION = gql`
  mutation ContactUs($input: ContactUsInput!) {
    contactUs(input: $input) {
      success
    }
  }
`
