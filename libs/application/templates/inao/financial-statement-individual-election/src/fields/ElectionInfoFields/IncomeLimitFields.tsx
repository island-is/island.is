import { useEffect } from 'react'
import {
  AlertMessage,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useLazyQuery } from '@apollo/client'
import { getFinancialLimit } from '../../graphql'
import { FSIUSERTYPE } from '../../types/types'
import { ABOUTIDS, GREATER, LESS } from '../../utils/constants'
import { m } from '../../lib/messages'

type IncomeLimitProps = {
  clientType?: FSIUSERTYPE
  year?: string
}

export const IncomeLimitFields = ({ year }: IncomeLimitProps) => {
  const { formatMessage, formatNumber } = useLocale()
  const [getLimit, { data, loading, error }] = useLazyQuery(getFinancialLimit, {
    variables: {
      input: { year, clientType: FSIUSERTYPE.INDIVIDUAL.toString() },
    },
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

  if (!limit) {
    return (
      <ContentBlock>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={formatMessage(m.financialLimitErrorMessage)}
        />
      </ContentBlock>
    )
  }

  if (error) {
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
          dataTestId: 'radio-incomeLimit-lessThan',
        },
        {
          label: `${formatMessage(m.moreThanLimit)} ${formatNumber(
            limit,
          )} ${formatMessage(m.crowns)}`,
          value: GREATER,
          dataTestId: 'radio-incomeLimit-moreThan',
        },
      ]}
    />
  )
}
