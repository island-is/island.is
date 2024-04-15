import { Application } from '@island.is/application/types'
import { Box, TopicCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { AttachmentLabel, AttachmentTypes } from '../../../constants'
import { Files, Attachments } from '../../../types'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Attachment: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { changeEmployerFile } = getApplicationAnswers(application.answers)

  const attachments: Attachments[] = []

  const getAttachmentDetails = (
    attachmentsArr: Files[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  if (changeEmployerFile?.length > 0) {
    getAttachmentDetails(changeEmployerFile, AttachmentTypes.CHANGE_EMPLOYER)
  }

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

export default Attachment
