import { Text } from '@island.is/island-ui/core'
import { NoDataScreen, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'

export const DelegationsNoData = () => {
  const { switchUser } = useAuth()
  const { formatMessage } = useLocale()

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
