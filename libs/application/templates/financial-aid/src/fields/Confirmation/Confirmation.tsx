import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'

import { getNextPeriod } from '@island.is/financial-aid/shared/lib'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'

import { confirmation, copyUrl } from '../../lib/messages'
import { DescriptionText, ConfirmationSectionImage, CopyUrl } from '..'

interface Props {
  firstStepText?: MessageDescriptor
  missingIncomeFiles: boolean
  hasSpouse?: boolean
  spouseEmailSuccess?: boolean
  municipalityHomepage?: string
}

const Confirmation = ({
  firstStepText,
  missingIncomeFiles,
  hasSpouse,
  spouseEmailSuccess,
  municipalityHomepage,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginTop={[4, 4, 5]}>
        {missingIncomeFiles ? (
          <AlertMessage
            type="warning"
            title={formatMessage(confirmation.alertMessages.dataNeeded)}
            message={formatMessage(confirmation.alertMessages.dataNeededText)}
          />
        ) : (
          <AlertMessage
            type="success"
            title={
              hasSpouse
                ? formatMessage(
                    confirmation.alertMessagesInRelationship.success,
                  )
                : formatMessage(confirmation.alertMessages.success)
            }
          />
        )}
        {hasSpouse && (
          <Box marginTop={[2, 2, 3]}>
            <AlertMessage
              type="warning"
              title={formatMessage(
                confirmation.alertMessagesInRelationship.dataNeeded,
              )}
              message={formatMessage(
                spouseEmailSuccess
                  ? confirmation.alertMessagesInRelationship.dataNeededText
                  : confirmation.alertMessagesInRelationship
                      .dataNeededAlternativeText,
              )}
            />
          </Box>
        )}
      </Box>

      <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        {firstStepText && <DescriptionText text={firstStepText} />}
        <Box marginTop={2}>
          <DescriptionText
            text={confirmation.nextSteps.content}
            format={{ nextMonth: getNextPeriod.month }}
          />
        </Box>
      </Box>

      {hasSpouse && (
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
          textProps={{ variant: 'small' }}
          format={{
            statusPage: window.location.href,
            homePage: municipalityHomepage || '',
          }}
        />
      </Box>
      <Box marginTop={[4, 4, 6]}>
        <ConfirmationSectionImage />
      </Box>
    </>
  )
}

export default Confirmation
