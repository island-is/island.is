import React from 'react'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { bankInfoForm } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'

const BankInfoForm = ({ field, application }: FAFieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useIntl()
  const { answers } = application

  const bankNumberId = `${id}.bankNumber`
  const ledgerId = `${id}.ledger`
  const accountNumberId = `${id}.accountNumber`

  return (
    <>
      <Text marginTop={2} marginBottom={[2, 2, 4]}>
        {formatMessage(bankInfoForm.general.info)}
      </Text>
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={bankNumberId}
              name={bankNumberId}
              defaultValue={answers?.bankInfo?.bankNumber}
              label={formatMessage(bankInfoForm.inputsLabels.bankNumber)}
              format="####"
              backgroundColor="blue"
              autoFocus
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '2/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={ledgerId}
              name={ledgerId}
              defaultValue={answers?.bankInfo?.ledger}
              label={formatMessage(bankInfoForm.inputsLabels.ledger)}
              format="##"
              backgroundColor="blue"
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={accountNumberId}
              name={accountNumberId}
              defaultValue={answers?.bankInfo?.accountNumber}
              label={formatMessage(bankInfoForm.inputsLabels.accountNumber)}
              format="######"
              backgroundColor="blue"
            />
          </Box>
        </GridColumn>
      </GridRow>
      <Text as="h3" variant="h4" marginBottom={1}>
        {formatMessage(bankInfoForm.general.descriptionTitle)}
      </Text>

      <Text variant="small">
        {formatMessage(bankInfoForm.general.description)}
      </Text>
    </>
  )
}

export default BankInfoForm
