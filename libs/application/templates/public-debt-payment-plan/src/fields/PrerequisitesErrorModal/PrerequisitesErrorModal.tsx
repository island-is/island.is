import { PaymentScheduleConditions } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, ModalBase, Text } from '@island.is/island-ui/core'
import React from 'react'
import { errorModal } from '../../lib/messages'
import { PaymentPlanExternalData } from '../../types'
import * as styles from './PrerequisitesErrorModal.treat'

export const PrerequisitesErrorModal = ({ application }: FieldBaseProps) => {
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
          {prerequisites.maxDebt ? errorModal.maxDebt : ''}
          {prerequisites.taxReturns ? errorModal.taxReturns : ''}
          {prerequisites.vatReturns ? errorModal.vatReturns : ''}
          {prerequisites.citReturns ? errorModal.citReturns : ''}
          {prerequisites.accommodationTaxReturns
            ? errorModal.accommodationTaxReturns
            : ''}
          {prerequisites.withholdingTaxReturns
            ? errorModal.withholdingTaxReturns
            : ''}
          {prerequisites.wageReturns ? errorModal.wageReturns : ''}
        </Text>
      </Box>
    </ModalBase>
  )
}
