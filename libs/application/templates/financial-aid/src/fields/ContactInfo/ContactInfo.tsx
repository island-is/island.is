import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { contactInfo } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { answersSchema } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'

const ContactInfo = ({ field, errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { id } = field
  const { clearErrors } = useFormContext()

  const emailPath = `${id}.email`
  const phonePath = `${id}.phone`

  return (
    <>
      <Text marginTop={2}>
        {formatMessage(contactInfo.general.description)}
      </Text>
      <Box marginTop={[2, 2, 4]}>
        <InputController
          id={emailPath}
          name={emailPath}
          backgroundColor="blue"
          type="email"
          label={formatMessage(contactInfo.emailInput.label)}
          placeholder={formatMessage(contactInfo.emailInput.placeholder)}
          error={getValueViaPath(errors, emailPath)}
          defaultValue={
            id === Routes.SPOUSECONTACTINFO
              ? getValueViaPath(answers as answersSchema, emailPath) ||
                answers.spouse?.email ||
                answers.relationshipStatus?.spouseEmail
              : getValueViaPath(answers as answersSchema, emailPath)
          }
          onChange={() => {
            clearErrors(emailPath)
          }}
        />
      </Box>
      <Box marginTop={[2, 2, 3]}>
        <InputController
          id={phonePath}
          name={phonePath}
          backgroundColor="blue"
          format="#######"
          type="tel"
          label={formatMessage(contactInfo.phoneInput.label)}
          placeholder={formatMessage(contactInfo.phoneInput.placeholder)}
          error={getValueViaPath(errors, phonePath)}
          defaultValue={getValueViaPath(answers as answersSchema, phonePath)}
          onChange={() => {
            clearErrors(phonePath)
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfo
