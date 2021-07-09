import { PaymentScheduleConditions } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, ModalBase, Text } from '@island.is/island-ui/core'
import React from 'react'
import { PaymentPlanExternalData } from '../../lib/dataSchema'
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
          {prerequisites.maxDebt ? 'Skuldar of mikið' : ''}
          {prerequisites.taxReturns ? 'Ekki búinn að skila skattaskýrslu' : ''}
          {prerequisites.vatReturns ? 'Ekki búinn að skila vat' : ''}
          {prerequisites.citReturns ? 'Ekki búið að skila cit' : ''}
          {prerequisites.accommodationTaxReturns ? 'Accomodations tax' : ''}
          {prerequisites.withholdingTaxReturns ? 'Witholding tax returns' : ''}
          {prerequisites.wageReturns ? 'Wage returns' : ''}
        </Text>
      </Box>
    </ModalBase>
  )
}
