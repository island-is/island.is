import { useParams } from 'react-router-dom'
import { AuthDomainDirection } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { useAuthScopeTreeLazyQuery } from '../components/access/AccessList/AccessListContainer/AccessListContainer.generated'
import { useAuthDelegationQuery } from '../screens/AccessOutgoing/AccessOutgoing.generated'
import { AuthCustomDelegationOutgoing } from '../types/customDelegation'

type UseParams = {
  delegationId: string
}

/**
 * Wrapper hook for fetching delegation by id from url param
 * and fetching delegation scope tree once delegation by id resolves.
 */
export const useDelegation = (direction?: AuthDomainDirection) => {
  const { lang } = useLocale()
  const { delegationId } = useParams() as UseParams

  const [
    getAuthScopeTreeQuery,
    { data: scopeTreeData, loading: scopeTreeLoading, error: scopeTreeError },
  ] = useAuthScopeTreeLazyQuery()

  const {
    data,
    loading: delegationLoading,
    error: delegationError,
  } = useAuthDelegationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        delegationId: delegationId as string,
      },
      lang,
    },
    onCompleted(data) {
      const delegation = data?.authDelegation
        ? (data.authDelegation as AuthCustomDelegationOutgoing)
        : undefined

      if (delegation) {
        getAuthScopeTreeQuery({
          variables: {
            input: {
              domain: delegation?.domain.name,
              lang,
              ...(direction && { direction }),
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
      ? (data.authDelegation as AuthCustomDelegationOutgoing)
      : undefined,
    delegationLoading,
    scopeTreeLoading,
    scopeTreeError,
    delegationError,
  }
}
