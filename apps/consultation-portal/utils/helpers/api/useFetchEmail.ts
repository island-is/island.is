import initApollo from '../../../graphql/client'
import { SUB_GET_EMAIL } from '../../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

export const useFetchEmail = () => {
  const client = initApollo()
  const { data, loading } = useQuery(SUB_GET_EMAIL, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
  })

  const { consultationPortalUserEmail: userEmail = [] } = data ?? {}

  const { email = '', emailVerified = false } = userEmail
  return {
    email,
    emailVerified,
    getUserEmailLoading: loading,
  }
}
