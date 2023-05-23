import initApollo from '../../graphql/client'
import { SUB_GET_EMAIL } from '../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

interface Props {
  isAuthenticated: boolean
}

export const useFetchEmail = ({ isAuthenticated }: Props) => {
  const client = initApollo()
  const { data, loading } = useQuery(SUB_GET_EMAIL, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  })

  const { consultationPortalUserEmail: userEmail = [] } = data ?? {}

  const { email = '', emailVerified = false } = userEmail
  return {
    email,
    emailVerified,
    getUserEmailLoading: loading,
  }
}
