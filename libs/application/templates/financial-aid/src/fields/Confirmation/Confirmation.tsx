import React from 'react'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { confirmation, copyUrl } from '../../lib/messages'
import { DescriptionText, ConfirmationSectionImage, CopyUrl } from '..'

const Confirmation = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { externalData } = application
  return (
    <>
      <Box marginTop={[4, 4, 5]}>
        <Box>
          <AlertMessage
            type="success"
            title={formatMessage(confirmation.alertMessages.success)}
          />
        </Box>
        <Box marginTop={[2, 2, 3]}>
          {/* //Todo customize alert message depending on applicant */}
          <AlertMessage
            type="warning"
            title={formatMessage(confirmation.alertMessages.dataNeeded)}
            message={formatMessage(confirmation.alertMessages.dataNeededText)}
          />
        </Box>
      </Box>
      <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={confirmation.nextSteps.content} />
      </Box>

      {externalData.nationalRegistry?.data?.applicant?.spouse && (
        <>
          <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
            {formatMessage(confirmation.sharedLink.title)}
          </Text>
          <Box marginTop={2}>
            <CopyUrl
              inputLabel={formatMessage(copyUrl.inputLabel)}
              buttonLabel={formatMessage(copyUrl.buttonLabel)}
              successMessage={formatMessage(copyUrl.successMessage)}
            />
          </Box>
        </>
      )}

      <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
        {formatMessage(confirmation.links.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText
          text={confirmation.links.content}
          format={{
            statusPage: window.location.href,
            homePage:
              externalData?.nationalRegistry?.data?.municipality?.homepage ||
              '',
          }}
        />
      </Box>

      <Box marginTop={[4, 4, 5]}>
        <ConfirmationSectionImage />
      </Box>
    </>
  )
}

export default Confirmation
