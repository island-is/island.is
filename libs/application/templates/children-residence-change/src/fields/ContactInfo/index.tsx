import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { contactInfo } from '../../lib/messages'
import { extractUserInfoFromApplication } from '../../lib/utils'

const parentAEmailId = 'parentAEmail'
const parentAPhoneNumberId = 'parentAPhoneNumber'

export const parentAContactInfoIds = [parentAEmailId, parentAPhoneNumberId]

const parentBEmailId = 'parentBEmail'
const parentBPhoneNumberId = 'parentBPhoneNumber'

export const parentBContactInfoIds = [parentBEmailId, parentBPhoneNumberId]

const ContactInfo = ({ errors, application, field }: FieldBaseProps) => {
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }
  const { formatMessage } = useIntl()
  const { setValue, register } = useFormContext()
  const userInfo = extractUserInfoFromApplication(application)
  const emailId =
    field.id === 'parentAContactInfo' ? parentAEmailId : parentBEmailId
  const phoneNumberId =
    field.id === 'parentAContactInfo'
      ? parentAPhoneNumberId
      : parentBPhoneNumberId
  const emailError = errors?.[emailId]
  const phoneNumberError = errors?.[phoneNumberId]
  return (
    <>
      <Box marginTop={3}>
        <Text marginTop={3}>
          {formatMessage(contactInfo.general.description)}
        </Text>
      </Box>
      <Box marginTop={5}>
        <Controller
          name={emailId}
          defaultValue={getValue(emailId) || userInfo.email}
          render={({ value, onChange }) => {
            return (
              <Input
                ref={register}
                id={emailId}
                name={emailId}
                backgroundColor="blue"
                type="email"
                label={formatMessage(contactInfo.inputs.emailLabel)}
                value={value}
                hasError={emailError !== undefined}
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
          defaultValue={getValue(phoneNumberId) || userInfo.mobilePhoneNumber}
          render={({ value, onChange }) => {
            return (
              <Input
                ref={register}
                id={phoneNumberId}
                name={phoneNumberId}
                backgroundColor="blue"
                type="tel"
                label={formatMessage(contactInfo.inputs.phoneNumberLabel)}
                value={value}
                required={true}
                hasError={phoneNumberError !== undefined}
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
