import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const GetIdentityDocumentQuery = gql`
  query GetIdentityDocumentQuery {
    getIdentityDocument {
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
  }
`

export const usePassport = () => {
  const { data, loading, error } = useQuery<Query>(GetIdentityDocumentQuery)

  return {
    data: data?.getIdentityDocument,
    loading,
    error,
  }
}
