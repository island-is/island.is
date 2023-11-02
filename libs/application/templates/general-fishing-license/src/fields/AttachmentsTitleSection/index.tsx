import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { ATTACHMENT_INFO_FIELD_ID } from '../../utils/fields'
import { useLocale } from '@island.is/localization'
import { fishingLicenseFurtherInformation } from '../../lib/messages'

export const AttachmentsTitleSection: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { getValues } = useFormContext()
  const description = getValues(ATTACHMENT_INFO_FIELD_ID)
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={4} marginBottom={2}>
      <Box marginBottom={2}>
        <Text variant="h5">
          {formatMessage(fishingLicenseFurtherInformation.labels.attachments)}
        </Text>
      </Box>
      <Box>
        <Text>
          {description ||
            formatMessage(
              fishingLicenseFurtherInformation.fieldInformation.attachments,
            )}
        </Text>
      </Box>
    </Box>
  )
}
