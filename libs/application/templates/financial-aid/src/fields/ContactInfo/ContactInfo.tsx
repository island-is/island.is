import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { FAFieldBaseProps, InputTypes } from '../../lib/types'
import { useIntl } from 'react-intl'
import { contactInfo } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const ContactInfo = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { clearErrors } = useFormContext()

  const emailInput = {
    id: 'contactInfo.email',
    error: errors?.contactInfo?.email,
  } as InputTypes

  const phoneInput = {
    id: 'contactInfo.phone',
    error: errors?.contactInfo?.phone,
  } as InputTypes

  return (
    <>
      <Text marginTop={2}>
        {formatMessage(contactInfo.general.description)}
      </Text>
      <Box marginTop={[2, 2, 4]}>
        <InputController
          id={emailInput.id}
          name={emailInput.id}
          backgroundColor="blue"
          type="email"
          label={formatMessage(contactInfo.emailInput.label)}
          placeholder={formatMessage(contactInfo.emailInput.placeholder)}
          error={emailInput.error}
          defaultValue={answers?.contactInfo?.email}
          onChange={() => {
            clearErrors(emailInput.error)
          }}
        />
      </Box>
      <Box marginTop={[2, 2, 3]}>
        <InputController
          id={phoneInput.id}
          name={phoneInput.id}
          backgroundColor="blue"
          type="tel"
          label={formatMessage(contactInfo.phoneInput.label)}
          placeholder={formatMessage(contactInfo.phoneInput.placeholder)}
          error={phoneInput.error}
          defaultValue={answers?.contactInfo?.phone}
          onChange={() => {
            clearErrors(phoneInput.id)
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfo
