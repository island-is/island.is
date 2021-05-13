import { FieldBaseProps } from '@island.is/application/core'
import React from 'react'
import {
  Button,
  Box,
  ModalBase,
  Text,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './PrerequisitesErrorModal.treat'
import { Prerequisites } from '../../dataProviders/tempAPITypes'

export const PrerequisitesErrorModal = ({ application }: FieldBaseProps) => {
  const prerequisites = application.externalData.paymentPlanPrerequisites
    .data as Prerequisites

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
          {!prerequisites.maxDebtOk ? prerequisites.maxDebtText : ''}
          {!prerequisites.taxReturnsOk ? prerequisites.taxReturnsText : ''}
          {!prerequisites.vatOk ? prerequisites.vatText : ''}
          {!prerequisites.citOk ? prerequisites.citText : ''}
          {!prerequisites.accommodationTaxOk
            ? prerequisites.accommodationTaxText
            : ''}
          {!prerequisites.withholdingTaxOk
            ? prerequisites.withholdingTaxText
            : ''}
          {!prerequisites.wageReturnsOk ? prerequisites.wageReturnsText : ''}
        </Text>
      </Box>
    </ModalBase>
  )
}
