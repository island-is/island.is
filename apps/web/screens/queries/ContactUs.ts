import gql from 'graphql-tag'

export const CONTACT_US_MUTATION = gql`
  mutation ContactUs($input: ContactUsInput!) {
    contactUs(input: $input) {
      sent
    }
  }
`

export const CONTACT_US_ZENDESK_TICKET_MUTATION = gql`
  mutation ContactUsZendeskTicket($input: ContactUsInput!) {
    contactUsZendeskTicket(input: $input) {
      sent
    }
  }
`
