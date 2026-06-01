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
          list {
            label {
              is
              en
            }
            description {
              is
              en
            }
            value
            displayOrder
            isSelected
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
