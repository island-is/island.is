import React, { useEffect, useState } from 'react'
import add from 'date-fns/add'

import {
  Box,
  Checkbox,
  DatePicker,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { m as portalMessages, NotFound } from '@island.is/portals/core'
import { AuthDomainDirection } from '@island.is/api/schema'

import { useLocale, useNamespaces } from '@island.is/localization'
import { AccessForm } from '../../components/access/AccessForm/AccessForm'
import { useDelegation } from '../../hooks/useDelegation'
import { AccessHeader } from '../../components/access/AccessHeader/AccessHeader'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

const AccessOutgoing = () => {
  useNamespaces(['sp.access-control-delegations'])
  const { md } = useBreakpoint()
  const { formatMessage, lang } = useLocale()
  const {
    delegation,
    scopeTree,
    delegationLoading,
    scopeTreeError,
    delegationError,
    scopeTreeLoading,
  } = useDelegation(AuthDomainDirection.outgoing)
  /**
   * If validity period is set then user cannot change scopes validity period individually
   */
  const [enableValidityPeriod, setEnableValidityPeriod] = useState(false)
  const defaultDate = add(new Date(), { years: 1 })

  const delegationValidityPeriod = delegation?.validTo
    ? new Date(delegation?.validTo)
    : null

  const [validityPeriod, setValidityPeriod] = useState(delegationValidityPeriod)

  const onValidityPeriodCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    setEnableValidityPeriod(checked)

    if (checked) {
      setValidityPeriod(delegationValidityPeriod ?? defaultDate)
    } else {
      setValidityPeriod(null)
    }
  }

  useEffect(() => {
    const scopesCnt = delegation?.scopes ? delegation.scopes.length : 0

    if (delegation) {
      if (delegation?.validTo && scopesCnt > 0) {
        setEnableValidityPeriod(!!delegation.validTo)
        setValidityPeriod(new Date(delegation.validTo))
      } else if (scopesCnt === 0) {
        // We do not want to set validity period to default date if there are scopes already set
        setEnableValidityPeriod(true)
        setValidityPeriod(defaultDate)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegation])

  if (!delegationLoading && !delegation) {
    return <NotFound />
  }

  return (
    <Box
      marginTop={[3, 3, 3, 4]}
      display="flex"
      rowGap={[4, 4, 4, 5]}
      flexDirection="column"
    >
      <AccessHeader delegation={delegation}>
        <Box display="flex" flexDirection="column" rowGap={3}>
          {!md && <Text variant="h3">{formatMessage(m.validityPeriod)}</Text>}
          {delegation ? (
            <>
              <Checkbox
                name="validityPeriodCheck"
                id="validityPeriodCheck"
                label={formatMessage(m.sameValidityPeriod)}
                large={!validityPeriod || !md ? true : false}
                checked={enableValidityPeriod}
                onChange={onValidityPeriodCheck}
              />
              {enableValidityPeriod && (
                <DatePicker
                  id="validityPeriod"
                  size="sm"
                  label={formatMessage(portalMessages.date)}
                  backgroundColor="blue"
                  minDate={new Date()}
                  selected={validityPeriod ? validityPeriod : defaultDate}
                  locale={lang}
                  handleChange={setValidityPeriod}
                  placeholderText={formatMessage(portalMessages.chooseDate)}
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
      </AccessHeader>
      {scopeTreeError || delegationError ? (
        <Problem error={delegationError || scopeTreeError} />
      ) : scopeTreeLoading || delegationLoading ? (
        <SkeletonLoader width="100%" height={250} />
      ) : delegation && scopeTree ? (
        <AccessForm
          delegation={delegation}
          scopeTree={scopeTree}
          validityPeriod={validityPeriod}
        />
      ) : (
        <Problem />
      )}
    </Box>
  )
}

export default AccessOutgoing
