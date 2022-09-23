import { Box, Text, Tabs } from '@island.is/island-ui/core'
import {
  AccessDenied,
  IntroHeader,
  NoDataScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { Accesses } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { MessageDescriptor } from 'react-intl'

export const AuthDelegationsQuery = gql`
  query AuthDelegationsListQuery {
    authDelegations {
      ... on AuthCustomDelegation {
        validTo
      }
    }
  }
`

const AccessControl: ServicePortalModuleComponent = ({ userInfo, client }) => {
  useNamespaces('sp.settings-access-control')
  const { data, loading } = useQuery<Query>(AuthDelegationsQuery)
  const { switchUser } = useAuth()
  const { formatMessage } = useLocale()

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
  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)

  const isCompany = userInfo.profile.subjectType === 'legalEntity'
  const personDelegation = isDelegation && !isCompany

  if (personDelegation) {
    return <AccessDenied userInfo={userInfo} client={client} />
  }

  const creatTab = (
    label: MessageDescriptor,
    headerTitle: MessageDescriptor,
  ) => ({
    label: formatMessage(label),
    content: (
      <Box marginTop={8}>
        <IntroHeader
          title={headerTitle}
          intro={formatMessage({
            id: 'sp.access-control-delegations:header-intro',
            defaultMessage:
              'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
          })}
        />
        <Accesses />
      </Box>
    ),
  })

  return (
    <Box>
      {!loading && data && data?.authDelegations?.length > 0 && (
        <Tabs
          label="This is used as the aria-label as well"
          tabs={[
            creatTab(
              {
                id: 'sp.access-control-delegations:from-me',
                defaultMessage: 'Umboð frá mér',
              },
              {
                id: 'sp.access-control-delegations:from-me-title',
                defaultMessage: 'Umboð sem ég hef veitt',
              },
            ),
            creatTab(
              {
                id: 'sp.access-control-delegations:to-me',
                defaultMessage: 'Umboð til mín',
              },
              {
                id: 'sp.access-control-delegations:to-me-title',
                defaultMessage: 'Umboð sem ég hef fengið',
              },
            ),
          ]}
          contentBackground="white"
        />
      )}
    </Box>
  )
}

export default AccessControl
