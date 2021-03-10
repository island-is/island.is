import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { contactInfo } from '../../lib/messages'
import { extractUserInfoFromApplication } from '../../lib/utils'
import { CRCFieldBaseProps } from '../../types'

const emailId = 'email'
const phoneNumberId = 'phoneNumber'

export const contactInfoIds = [emailId, phoneNumberId]

const ContactInfo = ({ errors, application }: CRCFieldBaseProps) => {
  const { answers } = application
  const { formatMessage } = useIntl()
  const { setValue, register } = useFormContext()
  const userInfo = extractUserInfoFromApplication(application)
  const emailError = errors?.email
  const phoneNumberError = errors?.phoneNumber
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
          defaultValue={answers.email || userInfo.email}
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
          defaultValue={answers.phoneNumber || userInfo.mobilePhoneNumber}
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
