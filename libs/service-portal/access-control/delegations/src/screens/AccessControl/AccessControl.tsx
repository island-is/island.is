import { Box, Text, Tabs } from '@island.is/island-ui/core'
import {
  AccessDenied,
  IntroHeader,
  m,
  NoDataScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { DelegationsFromMe } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { useHistory, useLocation } from 'react-router-dom'

const TAB_DELEGATION_TO_FROM_ID = '0'
const TAB_DELEGATION_TO_ME_ID = '1'

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
  const history = useHistory()
  const location = useLocation()
  const isDelegationToMe =
    location.pathname === ServicePortalPath.AccessControlDelegationsToMe

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

  const tabChangeHandler = (id: string) => {
    const url =
      id === TAB_DELEGATION_TO_ME_ID
        ? ServicePortalPath.AccessControlDelegationsToMe
        : ServicePortalPath.AccessControlDelegations

    // Make sure not to add to history stack the same route twice in a row
    if (url !== location.pathname) {
      history.push(url)
    }
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.accessControl)}
        intro={formatMessage({
          id: 'sp.access-control-delegations:header-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
      {!loading && data && data?.authDelegations?.length > 0 && (
        <Box marginTop={9}>
          <Tabs
            selected={
              isDelegationToMe
                ? TAB_DELEGATION_TO_ME_ID
                : TAB_DELEGATION_TO_FROM_ID
            }
            onChange={tabChangeHandler}
            label={formatMessage(m.accessControlChooseDelegation)}
            tabs={[
              {
                label: formatMessage(m.accessControlDelegationsFromMe),
                content: (
                  <Box marginTop={8}>
                    <DelegationsFromMe />
                  </Box>
                ),
              },
              {
                label: formatMessage(m.accessControlDelegationsToMe),
                content: null,
              },
            ]}
            contentBackground="white"
          />
        </Box>
      )}
    </Box>
  )
}

export default AccessControl
