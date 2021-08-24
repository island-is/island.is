import { PaymentScheduleConditions } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, ModalBase, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { errorModal } from '../../lib/messages'
import { PaymentPlanExternalData } from '../../types'
import * as styles from './PrerequisitesErrorModal.treat'

export const PrerequisitesErrorModal = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const prerequisites = (application.externalData as PaymentPlanExternalData)
    .paymentPlanPrerequisites?.data?.conditions as PaymentScheduleConditions

  return (
    <ModalBase
      baseId="prerequisitesErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      modalLabel="Error prompt"
      hideOnClickOutside={false}
    >
      <Box background="white" padding={5}>
        <Text variant="h2">
          {prerequisites.maxDebt ? formatMessage(errorModal.maxDebt) : ''}
          {!prerequisites.taxReturns
            ? formatMessage(errorModal.taxReturns)
            : ''}
          {!prerequisites.vatReturns
            ? formatMessage(errorModal.vatReturns)
            : ''}
          {!prerequisites.citReturns
            ? formatMessage(errorModal.citReturns)
            : ''}
          {!prerequisites.accommodationTaxReturns
            ? formatMessage(errorModal.accommodationTaxReturns)
            : ''}
          {!prerequisites.withholdingTaxReturns
            ? formatMessage(errorModal.withholdingTaxReturns)
            : ''}
          {!prerequisites.wageReturns
            ? formatMessage(errorModal.wageReturns)
            : ''}
        </Text>
      </Box>
    </ModalBase>
  )
}
