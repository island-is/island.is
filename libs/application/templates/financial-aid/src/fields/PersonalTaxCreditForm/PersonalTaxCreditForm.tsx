import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { personalTaxCreditForm } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'

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
          defaultValue={answers?.personalTaxCredit}
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
          error={errors.personalTaxCredit}
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
