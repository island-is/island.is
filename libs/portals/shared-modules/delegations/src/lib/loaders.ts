import { PortalModuleRoutesProps } from '@island.is/portals/core'
import { LoaderFunction } from 'react-router-dom'
import {
  AuthDomainsDocument,
  AuthDomainsQuery,
} from '../hooks/useDomains/useDomains.generated'
import {
  AuthDelegationDirection,
  AuthDomainDirection,
} from '@island.is/api/schema'
import {
  AuthDelegationsOutgoingDocument,
  AuthDelegationsOutgoingQuery,
} from '../components/delegations/outgoing/DelegationsOutgoing.generated'
import { ALL_DOMAINS } from '../constants/domain'

export const prepareDomainName = (domainName: string | null) =>
  domainName === ALL_DOMAINS ? null : domainName

type WrappedLoaderFunction = (props: PortalModuleRoutesProps) => LoaderFunction

export const delegationsOutgoingLoader: WrappedLoaderFunction = ({
  client,
  userInfo,
}) => async () => {
  const lang = userInfo.profile.locale

  const domainResult = await client.query<AuthDomainsQuery>({
    query: AuthDomainsDocument,
    variables: {
      input: {
        lang,
        direction: AuthDomainDirection.outgoing,
      },
    },
  })

  if (domainResult.error) {
    throw domainResult.error
  }

  const delegationsResult = await client.query<AuthDelegationsOutgoingQuery>({
    query: AuthDelegationsOutgoingDocument,
    variables: {
      lang,
      input: {
        domain: '@island.is',
        direction: AuthDelegationDirection.outgoing,
      },
    },
  })

  if (delegationsResult.error) {
    throw delegationsResult.error
  }

  return {
    domains: domainResult.data?.authDomains,
    delegations: delegationsResult.data?.authDelegations,
  }
}
