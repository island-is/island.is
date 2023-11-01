import { useQuery } from '@apollo/client'
import { SUB_GET_EMAIL } from '../../graphql/queries.graphql'

interface Props {
  isAuthenticated: boolean
}

export const useFetchEmail = ({ isAuthenticated }: Props) => {
  const { data, loading } = useQuery(SUB_GET_EMAIL, {
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
