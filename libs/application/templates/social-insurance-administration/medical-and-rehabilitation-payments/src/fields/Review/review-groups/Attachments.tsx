import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box, TopicCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getAttachments } from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { ReviewGroupProps } from './props'

export const Attachments = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const attachments = getAttachments(application)

  return (
    attachments.length > 0 && (
      <ReviewGroup isLast>
        {attachments.map((attach, index) => {
          return (
            <Box key={index} marginBottom={2}>
              <Label>{formatMessage(attach.label)}</Label>
              {attach.attachments.map((attachment) => {
                const nameArray = attachment.name?.split('.')
                const fileType = nameArray.pop()?.toUpperCase()
                const fileName = nameArray.join()
                return (
                  <Box key={attachment.key} marginY={1}>
                    <TopicCard tag={fileType || undefined}>
                      {fileName}
                    </TopicCard>
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </ReviewGroup>
    )
  )
}
