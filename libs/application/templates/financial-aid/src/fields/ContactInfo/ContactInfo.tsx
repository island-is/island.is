import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { contactInfo } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const ContactInfo = ({ field, errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { id } = field
  const { clearErrors } = useFormContext()

  return (
    <>
      <Text marginTop={2}>
        {formatMessage(contactInfo.general.description)}
      </Text>
      <Box marginTop={[2, 2, 4]}>
        <InputController
          id={`${id}.email`}
          name={`${id}.email`}
          backgroundColor="blue"
          type="email"
          label={formatMessage(contactInfo.emailInput.label)}
          placeholder={formatMessage(contactInfo.emailInput.placeholder)}
          error={errors?.contactInfo?.email}
          defaultValue={answers?.contactInfo?.email}
          onChange={() => {
            clearErrors(`${id}.email`)
          }}
        />
      </Box>
      <Box marginTop={[2, 2, 3]}>
        <InputController
          id={`${id}.phonen`}
          name={`${id}.phone`}
          backgroundColor="blue"
          type="tel"
          label={formatMessage(contactInfo.phoneInput.label)}
          placeholder={formatMessage(contactInfo.phoneInput.placeholder)}
          error={errors?.contactInfo?.phone}
          defaultValue={answers?.contactInfo?.phone}
          onChange={() => {
            clearErrors(`${id}.phone`)
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfo
