import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { passportFragment } from './usePassport'

export const GetChildrenIdentityDocumentQuery = gql`
  query GetChildrenIdentityDocumentQuery {
    getIdentityDocumentChildren {
      childNationalId
      childName
      passports {
        ...identityDocumentFragment
      }
    }
  }
  ${passportFragment}
`

export const useChildrenPassport = () => {
  const { data, loading, error } = useQuery<Query>(
    GetChildrenIdentityDocumentQuery,
  )

  return {
    data: data?.getIdentityDocumentChildren,
    loading,
    error,
  }
}
