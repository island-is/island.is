import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { DelegationsFromMe, DelegationsAccessGuard } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useSessionStorage } from 'react-use'
import {
  AuthCustomDelegation,
  useAuthDelegationsQuery,
} from '@island.is/service-portal/graphql'
import { useDomains } from '../../hooks/useDomains'

const AccessControl: ServicePortalModuleComponent = (props) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()

  const [domainName, setDomainName] = useSessionStorage<string | null>(
    'domain',
    null,
  )
  useDomains(domainName)

  const { data, loading, refetch } = useAuthDelegationsQuery({
    variables: {
      input: {
        domain: domainName,
      },
    },
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
  })

  return (
    <DelegationsAccessGuard
      {...props}
      delegations={data?.authDelegations}
      delegationsLoading={loading}
    >
      <IntroHeader
        title={formatMessage(m.accessControl)}
        intro={formatMessage({
          id: 'sp.access-control-delegations:header-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
      <Box marginTop={8}>
        <DelegationsFromMe
          setDomainName={setDomainName}
          domainName={domainName}
          delegations={(data?.authDelegations as AuthCustomDelegation[]) ?? []}
          delegationsLoading={loading}
          refetchDelegations={(variables) => {
            refetch(variables)
          }}
        />
      </Box>
    </DelegationsAccessGuard>
  )
}

export default AccessControl
