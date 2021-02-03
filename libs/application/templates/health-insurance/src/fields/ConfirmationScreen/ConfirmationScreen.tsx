import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'
import Markdown from 'markdown-to-jsx'
import ManOnBenchIllustration from '../../assets/ManOnBenchIllustration'

const ConfirmationScreen: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const isMissingInfoConfirmation =
    field.id === 'successfulSubmissionMissingInfo'

  const pageTitle = isMissingInfoConfirmation
    ? m.successfulSubmissionMissingInfoTitle
    : m.successfulSubmissionTitle

  return (
    <Stack space={2}>
      <Text variant="h2">
        {formatText(pageTitle, application, formatMessage)}
      </Text>
      <Text>
        <Markdown>
          {formatText(
            () => ({
              ...m.successfulSubmissionMessage,
              values: { applicationNumber: application.id },
            }),
            application,
            formatMessage,
          )}
        </Markdown>
      </Text>
      <Box display="flex" justifyContent="center" paddingY={2} size={1}>
        <ManOnBenchIllustration />
      </Box>
      <Box marginBottom={6}>
        <BulletList>
          {!isMissingInfoConfirmation && (
            <Bullet>
              {formatText(m.nextStepReviewTime, application, formatMessage)}
            </Bullet>
          )}
          <Bullet>
            {formatText(m.nextStepStatusCheck, application, formatMessage)}
          </Bullet>
        </BulletList>
      </Box>
    </Stack>
  )
}

export default ConfirmationScreen
