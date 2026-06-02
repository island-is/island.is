import { gql } from '@apollo/client'
import { ValueFragment } from '../fragments/value'

export const GET_APPLICATION_JSON_SAMPLE = gql`
  query FormSystemApplicationJsonSample($input: FormSystemGetFormInput!) {
    formSystemApplicationJsonSample(input: $input) {
      jsonSample {
        id
        slug
        isTest
        status
        submittedAt
        fields {
          identifier
          screenIdentifier
          fieldType
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
