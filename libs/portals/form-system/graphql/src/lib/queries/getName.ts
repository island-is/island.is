import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql } from '@apollo/client'

export interface FormSystemNameByNationalIdQuery {
  formSystemNameByNationalId: { fulltNafn: string }
}
export interface FormSystemNameByNationalIdQueryVariables {
  input: string
}

export const GET_NAME_BY_NATIONALID = gql`
  query formSystemNameByNationalId($input: String!) {
    formSystemNameByNationalId(input: $input) {
      fulltNafn
    }
  }
` as TypedDocumentNode<
  FormSystemNameByNationalIdQuery,
  FormSystemNameByNationalIdQueryVariables
>
