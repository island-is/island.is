import { useParams } from 'react-router-dom'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import {
  useAuthDelegationQuery,
  useAuthScopeTreeLazyQuery,
} from '@island.is/service-portal/graphql'

/**
 * Wrapper hook for fetching delegation by id from url param
 * and fetching delegation scope tree once delegation by id resolves.
 */
export const useDelegation = () => {
  const { lang } = useLocale()
  const { delegationId } = useParams<{
    delegationId: string
  }>()

  const [
    getAuthScopeTreeQuery,
    { data: scopeTreeData, loading: scopeTreeLoading },
  ] = useAuthScopeTreeLazyQuery()

  const { data, loading: delegationLoading } = useAuthDelegationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        delegationId,
      },
      lang,
    },
    onCompleted(data) {
      const delegation = data?.authDelegation
        ? (data.authDelegation as AuthCustomDelegation)
        : undefined

      if (delegation) {
        getAuthScopeTreeQuery({
          variables: {
            input: {
              domain: delegation?.domain.name,
              lang,
            },
          },
        })
      }
    },
  })

  const { authScopeTree } = scopeTreeData || {}

  return {
    scopeTree: authScopeTree,
    delegation: data?.authDelegation
      ? (data.authDelegation as AuthCustomDelegation)
      : undefined,
    delegationLoading,
    scopeTreeLoading,
  }
}
