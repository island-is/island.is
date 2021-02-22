import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { otherParent } from '../../lib/messages'
import { extractParentFromApplication } from '../../lib/utils'

const emailId = 'email'
const phoneNumberId = 'phoneNumber'

export const contactInfoIds = [emailId, phoneNumberId]

const ContactInfo = ({ errors, application }: FieldBaseProps) => {
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }
  const { formatMessage } = useIntl()
  const { setValue, register } = useFormContext()
  const parent = extractParentFromApplication(application)
  const emailError = errors?.email
  const phoneNumberError = errors?.phoneNumber
  return (
    <>
      <Box marginTop={3}>
        <Text variant="intro">
          {formatMessage(otherParent.general.intro, {
            parentName: parent.name,
            parentSSN: parent.ssn,
          })}
        </Text>
        <Text marginTop={3}>
          {formatMessage(otherParent.general.description)}
        </Text>
      </Box>
      <Box marginTop={5}>
        <Controller
          name={emailId}
          defaultValue={getValue(phoneNumberId)}
          render={({ value, onChange }) => {
            return (
              <Input
                ref={register}
                id={emailId}
                name={emailId}
                backgroundColor="blue"
                type="email"
                label={formatMessage(otherParent.inputs.emailLabel)}
                value={value}
                hasError={!!emailError}
                errorMessage={emailError as string}
                required={true}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(emailId, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box marginTop={2}>
        <Controller
          name={phoneNumberId}
          defaultValue={getValue(phoneNumberId)}
          render={({ value, onChange }) => {
            return (
              <Input
                ref={register}
                id={phoneNumberId}
                name={phoneNumberId}
                backgroundColor="blue"
                type="tel"
                label={formatMessage(otherParent.inputs.phoneNumberLabel)}
                value={value}
                required={true}
                hasError={!!phoneNumberError}
                errorMessage={phoneNumberError as string}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(phoneNumberId, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfo
