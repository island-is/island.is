import { useParams } from 'react-router-dom'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { useAuthDelegationQuery } from '@island.is/service-portal/graphql'

/**
 * Wrapper hook for getting delegation by id from url param
 */
export const useDelegation = () => {
  const { lang } = useLocale()
  const { delegationId } = useParams<{
    delegationId: string
  }>()

  const { data, loading } = useAuthDelegationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        delegationId,
      },
      lang,
    },
  })

  return {
    delegation: data?.authDelegation
      ? (data.authDelegation as AuthCustomDelegation)
      : undefined,
    loading,
  }
}
