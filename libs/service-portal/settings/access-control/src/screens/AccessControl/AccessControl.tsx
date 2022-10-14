import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  AccessDenied,
  IntroHeader,
  m,
  NoDataScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { Accesses } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ISLAND_DOMAIN } from '../../constants'
import { Query } from '@island.is/api/schema'

export const AuthDelegationsQuery = gql`
  query AuthDelegationsListQuery($input: AuthDelegationsInput) {
    authDelegations(input: $input) {
      ... on AuthCustomDelegation {
        validTo
      }
    }
  }
`
const AccessControl: ServicePortalModuleComponent = ({ userInfo, client }) => {
  useNamespaces('sp.settings-access-control')
  const { data, loading } = useQuery<Query>(AuthDelegationsQuery, {
    variables: { input: { domain: ISLAND_DOMAIN } },
  })
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
          link: ServicePortalPath.SettingsAccessControlGrant,
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
  return (
    <Box>
      {!loading && data && data?.authDelegations?.length > 0 && (
        <>
          <IntroHeader
            title={m.accessControl}
            intro={formatMessage({
              id: 'sp.settings-access-control:home-intro',
              defaultMessage:
                'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
            })}
          />
          <Accesses />
        </>
      )}
    </Box>
  )
}

export default AccessControl
