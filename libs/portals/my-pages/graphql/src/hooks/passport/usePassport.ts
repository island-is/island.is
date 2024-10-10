import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

export const passportFragment = gql`
  fragment identityDocumentFragment on IdentityDocumentModel {
    number
    type
    verboseType
    subType
    status
    issuingDate
    expirationDate
    displayFirstName
    displayLastName
    mrzFirstName
    mrzLastName
    sex
    numberWithType
    expiryStatus
    expiresWithinNoticeTime
  }
`

export const GetIdentityDocumentQuery = gql`
  query GetIdentityDocumentQuery {
    getIdentityDocument {
      ...identityDocumentFragment
    }
  }
  ${passportFragment}
`

export const usePassport = () => {
  const { data, loading, error } = useQuery<Query>(GetIdentityDocumentQuery)

  return {
    data: data?.getIdentityDocument,
    loading,
    error,
  }
}
