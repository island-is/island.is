import React from 'react'
import {
  AlertMessage,
  Box,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ABOUTIDS, BACKYEARSLIMITFALLBACK } from '../../lib/constants'
import * as styles from './styles.css'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { possibleOperatingYears } from '../../lib/utils/helpers'
import { useQuery } from '@apollo/client'
import { getAuditConfig } from '../../graphql'

export const OperatingYear = () => {
  const { data, loading, error } = useQuery(getAuditConfig)

  const { formatMessage } = useLocale()
  const { errors } = useFormContext()

  if (loading) {
    return (
      <Box width="half" className={styles.selectSpace}>
        <SkeletonLoader height={90} />
      </Box>
    )
  }

  if (error || data?.financialStatementsInaoConfig?.length <= 0) {
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

  const backwardsYearLimit =
    data.financialStatementsInaoConfig?.[0]?.value || BACKYEARSLIMITFALLBACK
  const operatingYear = possibleOperatingYears(backwardsYearLimit)

  return (
    <Box width="half" className={styles.selectSpace}>
      <SelectController
        id={ABOUTIDS.operatingYear}
        name={ABOUTIDS.operatingYear}
        backgroundColor="blue"
        label={formatMessage(m.operatingYear)}
        placeholder={formatMessage(m.selectOperatingYear)}
        error={errors && getErrorViaPath(errors, ABOUTIDS.operatingYear)}
        options={operatingYear}
        defaultValue={operatingYear[0]}
      />
    </Box>
  )
}
