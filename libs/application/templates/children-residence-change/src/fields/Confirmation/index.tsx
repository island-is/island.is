import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { confirmation, copyUrl } from '../../lib/messages'
import { CopyUrl } from '../components'
import { CRCFieldBaseProps } from '../..'

const Confirmation = ({ application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Box marginTop={3}>
        <Text>
          {formatMessage(confirmation.general.description, {
            emailParagraph: answers.counterParty.email
              ? formatMessage(
                  confirmation.general.description.paragraphs.email,
                  { email: answers.counterParty.email },
                )
              : '',
            phoneNumberParagraph: answers.counterParty.phoneNumber
              ? formatMessage(
                  confirmation.general.description.paragraphs.phoneNumber,
                  { phoneNumber: answers.counterParty.phoneNumber },
                )
              : '',
            count: [
              answers.counterParty.email,
              answers.counterParty.phoneNumber,
            ].filter((a) => a !== '').length,
          })}
        </Text>
      </Box>
      <Box marginTop={5}>
        <CopyUrl
          title={formatMessage(copyUrl.title)}
          inputLabel={formatMessage(copyUrl.inputLabel)}
          buttonLabel={formatMessage(copyUrl.buttonLabel)}
          successMessage={formatMessage(copyUrl.successMessage)}
        />
      </Box>
    </>
  )
}

export default Confirmation
