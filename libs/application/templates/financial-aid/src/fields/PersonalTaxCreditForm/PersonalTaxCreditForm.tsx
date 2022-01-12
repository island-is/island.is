import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { personalTaxCreditForm } from '../../lib/messages'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const PersonalTaxCreditForm = ({
  field,
  errors,
  application,
}: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Text marginTop={2}>
        {formatMessage(personalTaxCreditForm.general.recommendedChoice)}
      </Text>
      <Box marginTop={[3, 3, 4]}>
        <RadioController
          id={field.id}
          defaultValue={answers?.personalTaxCreditForm}
          options={[
            {
              value: ApproveOptions.Yes,
              label: formatMessage(
                personalTaxCreditForm.radioChoices.useTaxCredit,
              ),
            },
            {
              value: ApproveOptions.No,
              label: formatMessage(
                personalTaxCreditForm.radioChoices.wontUseTaxCredit,
              ),
            },
          ]}
          split="1/2"
          largeButtons
          backgroundColor="white"
          error={errors.personalTaxCreditForm}
        />
      </Box>
      <Text as="h3" variant="h3" marginTop={[2, 2, 3]}>
        {formatMessage(personalTaxCreditForm.general.descriptionTitle)}
      </Text>
      <Text marginTop={1} variant="small">
        {formatMessage(personalTaxCreditForm.general.description)}
      </Text>
    </>
  )
}

export default PersonalTaxCreditForm
