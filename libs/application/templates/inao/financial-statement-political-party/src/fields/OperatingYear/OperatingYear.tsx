import {
  AlertMessage,
  Box,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PartiesBackwardLimit, PartiesYearAllowed } from '../../utils/constants'
import * as styles from './styles.css'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useQuery } from '@apollo/client'
import {
  getConfigInfoForKey,
  possibleOperatingYears,
} from '../../utils/helpers'
import { auditConfigQuery } from '../../graphql'
import { m } from '../../lib/messages'
import { ABOUTIDS } from '@island.is/libs/application/templates/inao/shared/utils/constants'

export const OperatingYear = () => {
  const { data, loading, error } = useQuery(auditConfigQuery)
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
  } = useFormContext()

  if (loading) {
    return (
      <Box width="half" className={styles.selectSpace}>
        <SkeletonLoader height={70} />
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

  const { financialStatementsInaoConfig } = data

  const backwardsYearLimit = getConfigInfoForKey(
    financialStatementsInaoConfig,
    PartiesBackwardLimit,
  )

  const countYearBackwardsFrom = getConfigInfoForKey(
    financialStatementsInaoConfig,
    PartiesYearAllowed,
  )

  const operatingYear = possibleOperatingYears(
    backwardsYearLimit,
    countYearBackwardsFrom,
  )

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
      />
    </Box>
  )
}
