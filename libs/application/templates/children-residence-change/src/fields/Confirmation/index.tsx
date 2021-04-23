import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { confirmation, copyUrl } from '../../lib/messages'
import { CopyUrl, DescriptionText } from '../components'
import { CRCFieldBaseProps } from '../..'

const Confirmation = ({ application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText
          text={confirmation.general.description}
          format={{
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
            ].reduce((value, item) => {
              return item ? value + 1 : value
            }, 0),
          }}
        />
      </Box>
      <Text variant="h4" marginTop={3}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText
          text={confirmation.nextSteps.description}
          format={{
            parentBName:
              externalData.nationalRegistry.data.children[0].otherParent
                .fullName,
          }}
        />
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
