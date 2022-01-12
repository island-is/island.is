import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { bankInfoForm } from '../../lib/messages'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const BankInfoForm = ({ field, errors, application }: FAFieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[2, 2, 4]}>
        {formatMessage(bankInfoForm.general.info)}
      </Text>
      <Box className={styles.bankInformationContainer}>
        <Box className={styles.bankNumber} marginBottom={[2, 2, 4]}>
          <InputController
            id={`${id}.bankNumber`}
            name={`${id}.bankNumber`}
            defaultValue={`${answers}.bankNumber`}
            label={formatMessage(bankInfoForm.inputsLabels.bankNumber)}
            format="####"
            backgroundColor="blue"
            autoFocus
          />
        </Box>
        <Box marginBottom={[2, 2, 4]}>
          <InputController
            id={`${id}.ledger`}
            name={`${id}.ledger`}
            defaultValue={`${answers}.ledger`}
            label={formatMessage(bankInfoForm.inputsLabels.ledger)}
            format="##"
            backgroundColor="blue"
          />
        </Box>
        <Box marginBottom={[2, 2, 4]} className={styles.accountNumber}>
          <InputController
            id={`${id}.accountNumber`}
            name={`${id}.accountNumber`}
            defaultValue={`${answers}.accountNumber`}
            label={formatMessage(bankInfoForm.inputsLabels.accountNumber)}
            format="######"
            backgroundColor="blue"
          />
        </Box>
      </Box>
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
