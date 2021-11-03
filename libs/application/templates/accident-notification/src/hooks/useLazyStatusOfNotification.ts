import { gql } from '@apollo/client'

export const getAccidentStatusQuery = gql`
  query NotificationStatus($input: AccidentStatusInput!) {
    accidentStatus(input: $input) {
      status
      receivedAttachments {
        InjuryCertificate
        ProxyDocument
        PoliceReport
      }
      receivedConfirmations {
        InjuredOrRepresentativeParty
        CompanyParty
      }
    }
  }
`
