import React from 'react'
import {
  AlertMessage,
  Box,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ABOUTIDS,
  CemeteriesBackwardLimit,
  PartiesBackwardLimit,
  CemeteriesYearAllowed,
  PartiesYearAllowed,
} from '../../lib/constants'
import * as styles from './styles.css'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useQuery } from '@apollo/client'
import {
  getConfigInfoForKey,
  getCurrentUserType,
  possibleOperatingYears,
} from '../../lib/utils/helpers'
import { getAuditConfig } from '../../graphql'
import { FSIUSERTYPE } from '../../types'

export const OperatingYear = ({
  application,
}: {
  application: Application
}) => {
  const { answers, externalData } = application

  const { data, loading, error } = useQuery(getAuditConfig)
  const { formatMessage } = useLocale()
  const { errors } = useFormContext()
  const userType = getCurrentUserType(answers, externalData)

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

  const backwardsYearLimit =
    userType === FSIUSERTYPE.PARTY
      ? getConfigInfoForKey(financialStatementsInaoConfig, PartiesBackwardLimit)
      : userType === FSIUSERTYPE.CEMETRY
      ? getConfigInfoForKey(
          financialStatementsInaoConfig,
          CemeteriesBackwardLimit,
        )
      : '0'

  const countYearBackwardsFrom =
    userType === FSIUSERTYPE.PARTY
      ? getConfigInfoForKey(financialStatementsInaoConfig, PartiesYearAllowed)
      : userType === FSIUSERTYPE.CEMETRY
      ? getConfigInfoForKey(
          financialStatementsInaoConfig,
          CemeteriesYearAllowed,
        )
      : '0'

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
        defaultValue={operatingYear[0].value}
      />
    </Box>
  )
}
