import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import add from 'date-fns/add'

import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { IntroHeader, NotFound } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuthDelegationQuery } from '@island.is/service-portal/graphql'
import { AccessForm, AccessHeaderCards } from '../../components/access'

const Access = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { md } = useBreakpoint()
  const { formatMessage, lang } = useLocale()
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

  /**
   * If validity period is set then user cannot change scopes validity period individually
   */
  const [enableValidityPeriod, setEnableValidityPeriod] = useState(false)
  const defaultDate = add(new Date(), { years: 1 })
  const [validityPeriod, setValidityPeriod] = useState(
    authDelegation?.validTo ? new Date(authDelegation?.validTo) : null,
  )

  const onValidityPeriodCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    setEnableValidityPeriod(checked)
    setValidityPeriod(checked ? defaultDate : null)
  }

  useEffect(() => {
    if (authDelegation?.validTo) {
      setEnableValidityPeriod(!!authDelegation.validTo)
      setValidityPeriod(new Date(authDelegation.validTo))
    }
  }, [authDelegation?.validTo])

  if (!loading && !delegationData?.authDelegation) {
    return <NotFound />
  }

  return (
    <>
      <Box display="flex" rowGap={6} flexDirection="column">
        <AccessHeaderCards
          identity={{
            name: authDelegation?.to?.name,
            nationalId: authDelegation?.to?.nationalId,
          }}
          domain={{
            name: 'Landsbankaappið',
            imgSrc: './assets/images/educationDegree.svg',
          }}
        />
        {hasDelegationData ? (
          <div>
            <Text variant="h3">
              {formatMessage({
                id: 'sp.access-control-delegations:validity-period',
                defaultMessage: 'Gildistími',
              })}
            </Text>
            <GridRow alignItems="flexEnd" marginTop={[3, 3, 3, 4]}>
              <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
                <Checkbox
                  name="validityPeriodCheck"
                  id="validityPeriodCheck"
                  label={formatMessage({
                    id: 'sp.access-control-delegations:same-validity-period',
                    defaultMessage: 'Sami gildistími fyrir öll réttindi',
                  })}
                  large
                  checked={enableValidityPeriod}
                  onChange={onValidityPeriodCheck}
                />
              </GridColumn>
              {enableValidityPeriod && (
                <GridColumn
                  span={['12/12', '12/12', '12/12', '4/12']}
                  paddingTop={2}
                >
                  <DatePicker
                    id="validityPeriod"
                    size={md ? 'md' : 'sm'}
                    label={formatMessage(m.date)}
                    backgroundColor="blue"
                    minDate={new Date()}
                    selected={validityPeriod ? validityPeriod : defaultDate}
                    locale={lang}
                    handleChange={setValidityPeriod}
                    placeholderText="Veldu dagsetningu"
                  />
                </GridColumn>
              )}
            </GridRow>
          </div>
        ) : (
          <SkeletonLoader width="100%" height={91} />
        )}
        <IntroHeader
          title={defineMessage({
            id: 'sp.access-control-delegations:access-title',
            defaultMessage: 'Réttindi',
          })}
          intro={defineMessage({
            id: 'sp.settings-access-control:access-intro',
            defaultMessage:
              'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
          })}
        />
      </Box>
      {hasDelegationData ? (
        <AccessForm
          delegation={authDelegation}
          validityPeriod={validityPeriod}
        />
      ) : (
        <SkeletonLoader width="100%" height={250} />
      )}
    </>
  )
}

export default Access
