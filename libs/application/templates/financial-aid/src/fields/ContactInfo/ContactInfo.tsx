import React from 'react'
import { Text } from '@island.is/island-ui/core'
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
      <InputController
        id={`email`}
        name={`email`}
        backgroundColor="blue"
        type="email"
        label={formatMessage(contactInfo.emailInput.label)}
        placeholder={formatMessage(contactInfo.emailInput.placeholder)}
        error={undefined}
        defaultValue={''}
        onChange={() => {
          // clearErrors(`${id}.email`)
        }}
      />
    </>
  )
}

export default ContactInfo
