import React from 'react'
import { useIntl } from 'react-intl'

import { getNextPeriod } from '@island.is/financial-aid/shared/lib'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { ApproveOptions, FAFieldBaseProps, UploadFileType } from '../../lib/types'
import { confirmation, copyUrl } from '../../lib/messages'
import { DescriptionText, ConfirmationSectionImage, CopyUrl } from '..'
import { hasFiles, hasSpouse } from '../../lib/utils'
import { Routes } from '../../lib/constants'

const Confirmation = ({ application, field }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application
  const { id } = field

  let incomeFileType: UploadFileType
  let hasIncome
  if (id === Routes.CONFIRMATION) {
    incomeFileType = 'incomeFiles'
    hasIncome = answers.income === ApproveOptions.Yes
  } else {
    incomeFileType = 'spouseIncomeFiles'
    hasIncome = answers.spouseIncome === ApproveOptions.Yes
  }

  return (
    <>
      <Box marginTop={[4, 4, 5]}>
        <Box>
          <AlertMessage
            type="success"
            title={formatMessage(confirmation.alertMessages.success)}
          />
        </Box>
        {hasIncome && !hasFiles(incomeFileType, answers) &&
          <Box marginTop={[2, 2, 3]}>
            <AlertMessage
              type="warning"
              title={formatMessage(confirmation.alertMessages.dataNeeded)}
              message={formatMessage(confirmation.alertMessages.dataNeededText)}
            />
          </Box>
        }
      </Box>
      <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={confirmation.nextSteps.content} format={{ nextMonth: getNextPeriod.month }} />
      </Box>

      {hasSpouse(answers, externalData) && (
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
          textProps={{ variant: "small" }}
          format={{
            statusPage: window.location.href,
            homePage:
              externalData?.nationalRegistry?.data?.municipality?.homepage ||
              '',
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
