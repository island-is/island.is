import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { passportFragment } from './usePassport'

const GetChildrenIdentityDocumentQuery = gql`
  query GetChildrenIdentityDocumentQuery {
    getIdentityDocumentChildren {
      childNationalId
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
