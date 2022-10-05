import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'

import { Box, Checkbox } from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  IntroHeader,
  NotFound,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { AccessForm, AccessHeaderCards } from '../../components'
import { useAuthDelegationQuery } from '@island.is/service-portal/graphql'

const Access: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const { delegationId } = useParams<{
    delegationId: string
  }>()

  const { data: delegationData, loading } = useAuthDelegationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        delegationId,
      },
    },
  })

  const authDelegation = (delegationData || {})
    .authDelegation as AuthCustomDelegation
  const hasDelegationData = !!authDelegation

  const [enableValidityPeriod, setEnableValidityPeriod] = useState(false)

  useEffect(() => {
    if (authDelegation) {
      setEnableValidityPeriod(!!authDelegation.validTo)
    }
  }, [authDelegation])

  if (!loading && !delegationData?.authDelegation) {
    return <NotFound />
  }

  return (
    <>
      <Box display="flex" rowGap={6} flexDirection="column">
        <AccessHeaderCards
          userInfo={userInfo}
          domain={{
            title: 'Landsbankaappið',
            imgSrc: './assets/images/educationDegree.svg',
          }}
        />
        {hasDelegationData && (
          <>
            <Box>
              <Checkbox
                name=""
                id="accept"
                backgroundColor="blue"
                label={formatMessage({
                  id: 'sp.access-control-delegations:same-validity-period',
                  defaultMessage: 'Sami gildistími fyrir öll réttindi',
                })}
                large
                checked={enableValidityPeriod}
                onChange={() => setEnableValidityPeriod(!enableValidityPeriod)}
              />
            </Box>
            <IntroHeader
              title={authDelegation?.to?.name || ''}
              intro={defineMessage({
                id: 'sp.settings-access-control:access-intro',
                defaultMessage:
                  'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
              })}
            />
          </>
        )}
      </Box>
      {hasDelegationData && <AccessForm delegation={authDelegation} />}
    </>
  )
}

export default Access
