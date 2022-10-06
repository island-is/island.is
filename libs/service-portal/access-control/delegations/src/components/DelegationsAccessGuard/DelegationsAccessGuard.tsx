import { Text } from '@island.is/island-ui/core'
import {
  AccessDenied,
  NoDataScreen,
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { useAuthDelegationsQuery } from '@island.is/service-portal/graphql'

export const DelegationsAccessGuard: ServicePortalModuleComponent = ({
  userInfo,
  client,
  children,
}) => {
  useNamespaces('sp.access-control-delegations')
  const { data, loading } = useAuthDelegationsQuery()
  const { switchUser } = useAuth()
  const { formatMessage } = useLocale()
  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)
  const isCompany = userInfo.profile.subjectType === 'legalEntity'
  const personDelegation = isDelegation && !isCompany

  if (personDelegation) {
    return <AccessDenied userInfo={userInfo} client={client} />
  }

  if (!loading && data?.authDelegations.length === 0) {
    return (
      <NoDataScreen
        title={formatMessage({
          id: 'sp.settings-access-control:empty-title',
          defaultMessage: 'Umboð',
        })}
        button={{
          type: 'internal',
          link: ServicePortalPath.AccessControlDelegationsGrant,
          text: formatMessage({
            id: 'sp.settings-access-control:empty-new-access',
            defaultMessage: 'Veita aðgang',
          }),
          variant: 'primary',
        }}
        secondaryButton={{
          type: 'click',
          onClick: () => switchUser(),
          text: formatMessage({
            id: 'sp.settings-access-control:empty-switch-access',
            defaultMessage: 'Skipta um notanda',
          }),
          variant: 'ghost',
        }}
      >
        <Text>
          {formatMessage({
            id: 'sp.settings-access-control:empty-intro',
            defaultMessage:
              'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
          })}
        </Text>
      </NoDataScreen>
    )
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
