import React, { useEffect } from 'react'
import {
  AlertMessage,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { getFinancialLimit } from '../../graphql'
import { ABOUTIDS, GREATER } from '../../lib/constants'
import { FSIUSERTYPE, LESS } from '../../types'

type IncomeLimitProps = {
  clientType?: FSIUSERTYPE
  year?: string
}

export const IncomeLimitFields = ({ clientType, year }: IncomeLimitProps) => {
  const { formatMessage, formatNumber } = useLocale()
  const userType = clientType ? clientType.toString() : undefined
  const [getLimit, { data, loading, error }] = useLazyQuery(getFinancialLimit, {
    variables: { input: { year, clientType: userType } },
  })
  useEffect(() => {
    if (year) {
      getLimit()
    }
  }, [year, getLimit])

  if (loading || !year) {
    return (
      <ContentBlock>
        <SkeletonLoader height={100} width="100%" borderRadius="large" />
        <SkeletonLoader height={100} width="100%" borderRadius="large" />
      </ContentBlock>
    )
  }
  const limit = data?.financialStatementsInaoClientFinancialLimit

  if (error || !limit) {
    return (
      <ContentBlock>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={formatMessage(m.fetchErrorMsg)}
        />
      </ContentBlock>
    )
  }

  return (
    <RadioController
      id={ABOUTIDS.incomeLimit}
      options={[
        {
          label: `${formatMessage(m.lessThanLimit)} ${formatNumber(
            limit,
          )} ${formatMessage(m.crowns)}`,
          value: LESS,
        },
        {
          label: `${formatMessage(m.moreThanLimit)} ${formatNumber(
            limit,
          )} ${formatMessage(m.crowns)}`,
          value: GREATER,
        },
      ]}
    />
  )
}
