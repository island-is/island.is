import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { FormSystemGetFormsInput } from '@island.is/api/schema'
import type { FormsQueryResponse } from '../../types'

export const GET_FORMS = gql`
  query FormSystemForms($input: FormSystemGetFormsInput!) {
    formSystemForms(input: $input) {
      forms {
        id
        name {
          is
        }
        slug
        modified
        status
        submissionServiceUrl
        isInaccessible
        lastModifiedBy
        derivedFrom
      }
      organizations {
        value
        label
        isSelected
      }
    }
  }
` as TypedDocumentNode<FormsQueryResponse, { input: FormSystemGetFormsInput }>
