import gql from 'graphql-tag'

export const DELIVER_CONTACT_US = gql`
  mutation ContactUs($input: ContactUsInput!) {
    contactUs(input: $input) {
      success
    }
  }
`
