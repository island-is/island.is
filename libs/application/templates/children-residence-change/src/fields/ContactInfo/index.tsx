import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { otherParent } from '../../lib/messages'
import { extractParentFromApplication } from '../../lib/utils'

const ContactInfo = ({ error, application, field }: FieldBaseProps) => {
  const { id } = field
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()
  const parent = extractParentFromApplication(application)
  // TODO: add validation
  console.log({error})
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
          name="email"
          defaultValue={getValue('email')}
          render={({ value, onChange }) => {
            return (
              <Input
                id="email"
                name="email"
                backgroundColor="blue"
                type="text"
                label={formatMessage(otherParent.inputs.emailLabel)}
                value={value}
                hasError={!!error}
                // errorMessage={error?.email}
                required={true}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue('email', e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box marginTop={2}>
        <Controller
          name="phoneNumber"
          defaultValue={getValue('phoneNumber')}
          render={({ value, onChange }) => {
            return (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                backgroundColor="blue"
                type="tel"
                label={formatMessage(otherParent.inputs.phoneNumberLabel)}
                value={value}
                required={true}
                hasError={!!error}
                // errorMessage={error?.phoneNumber}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue('phoneNumber', e.target.value)
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
