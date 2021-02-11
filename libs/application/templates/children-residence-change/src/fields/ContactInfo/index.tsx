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
          defaultValue={getValue('contactInfo')?.[0]}
          render={({ value, onChange }) => {
            return (
              <Input
                id={`${id}[0]`}
                name={`${id}[0]`}
                backgroundColor="blue"
                type="text"
                label={formatMessage(otherParent.inputs.emailLabel)}
                value={value}
                hasError={!!error}
                required={true}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(`${id}[0]`, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box marginTop={2}>
        <Controller
          name="phonenumber"
          defaultValue={getValue('contactInfo')?.[1]}
          render={({ value, onChange }) => {
            return (
              <Input
                id={`${id}[1]`}
                name={`${id}[1]`}
                backgroundColor="blue"
                type="tel"
                label={formatMessage(otherParent.inputs.phoneNumberLabel)}
                value={value}
                required={true}
                hasError={!!error}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(`${id}[1]`, e.target.value)
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
