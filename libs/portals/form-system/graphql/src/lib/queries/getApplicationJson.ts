import { gql } from '@apollo/client'
import { ValueFragment } from '../fragments/value'

export const GET_APPLICATION_JSON_SAMPLE = gql`
  query FormSystemApplicationJsonSample($input: FormSystemGetFormInput!) {
    formSystemApplicationJsonSample(input: $input) {
      jsonSample {
        id
        organizationNationalId
        slug
        isTest
        status
        submittedAt
        fields {
          identifier
          screenIdentifier
          screenTitle {
            is
            en
          }
          fieldTitle {
            is
            en
          }
          fieldType
          fieldSettings {
            isDecimal
            applicantType
          }
          values {
            order
            json {
              ...Value
            }
          }
        }
      }
    }
  }
  ${ValueFragment}
`
