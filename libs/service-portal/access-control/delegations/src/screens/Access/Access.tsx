import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { NotFound } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuthDelegationQuery } from '@island.is/service-portal/graphql'
import { AccessForm } from '../../components/access/AccessForm'
import * as styles from './Access.css'

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
      lang,
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
    const scopesCnt = authDelegation?.scopes ? authDelegation.scopes.length : 0

    if (authDelegation) {
      if (authDelegation?.validTo && scopesCnt > 0) {
        setEnableValidityPeriod(!!authDelegation.validTo)
        setValidityPeriod(new Date(authDelegation.validTo))
      } else if (scopesCnt === 0) {
        // We do not wan't to set validity period to default date if there are scopes already set
        setEnableValidityPeriod(true)
        setValidityPeriod(defaultDate)
      }
    }
  }, [authDelegation])

  if (!loading && !delegationData?.authDelegation) {
    return <NotFound />
  }

  const labelHeaderText = `${authDelegation?.to?.name} • ${authDelegation?.domain.displayName}`

  return (
    <Box
      marginTop={[3, 3, 3, 4]}
      display="flex"
      rowGap={5}
      flexDirection="column"
    >
      <GridRow
        alignItems={['flexStart', 'flexStart', 'flexStart', 'flexEnd']}
        className={styles.row}
      >
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box display="flex" flexDirection="column" rowGap={md ? 1 : 2}>
            <Text variant="h3" as="h1">
              {formatMessage({
                id: 'sp.access-control-delegations:access-title',
                defaultMessage: 'Réttindi',
              })}
            </Text>
            {hasDelegationData ? (
              <Text variant="eyebrow">{labelHeaderText}</Text>
            ) : (
              <SkeletonLoader width="60%" height={21} />
            )}
            <Text variant="default">
              {formatMessage({
                id: 'sp.settings-access-control:access-intro',
                defaultMessage:
                  'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
              })}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12', '4/12']}
          className={styles.checkboxColumn}
        >
          <Box display="flex" flexDirection="column" rowGap={3}>
            {!md && (
              <Text variant="h3">
                {formatMessage({
                  id: 'sp.access-control-delegations:validity-period',
                  defaultMessage: 'Gildistími',
                })}
              </Text>
            )}
            {hasDelegationData ? (
              <>
                <Checkbox
                  name="validityPeriodCheck"
                  id="validityPeriodCheck"
                  label={formatMessage({
                    id: 'sp.access-control-delegations:same-validity-period',
                    defaultMessage: 'Sami gildistími fyrir öll réttindi',
                  })}
                  large={!validityPeriod || !md ? true : false}
                  checked={enableValidityPeriod}
                  onChange={onValidityPeriodCheck}
                />
                {enableValidityPeriod && (
                  <DatePicker
                    id="validityPeriod"
                    size="sm"
                    label={formatMessage(m.date)}
                    backgroundColor="blue"
                    minDate={new Date()}
                    selected={validityPeriod ? validityPeriod : defaultDate}
                    locale={lang}
                    handleChange={setValidityPeriod}
                    placeholderText={formatMessage(m.chooseDate)}
                  />
                )}
              </>
            ) : (
              <SkeletonLoader
                width="100%"
                height={enableValidityPeriod ? (md ? 115 : 167) : md ? 91 : 72}
              />
            )}
          </Box>
        </GridColumn>
      </GridRow>
      {hasDelegationData ? (
        <AccessForm
          delegation={authDelegation}
          validityPeriod={validityPeriod}
        />
      ) : (
        <SkeletonLoader width="100%" height={250} />
      )}
    </Box>
  )
}

export default Access
