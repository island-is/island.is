import { Application } from '@island.is/application/core'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FileUploadController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { UPLOAD_ACCEPT } from '../../constants'
import { addDocuments } from '../../lib/messages'
import { hasMissingInjuryCertificate } from '../../utils'

type UploadAttachmentsInReviewProps = {
  application: Application
  setState: React.Dispatch<React.SetStateAction<string>>
}

export const UploadAttachmentsInReview: FC<UploadAttachmentsInReviewProps> = ({
  application,
  setState,
}) => {
  const { formatMessage } = useLocale()

  const onBackButtonClick = () => {
    setState('inReviewSteps')
  }
  const onForwardButtonClick = () => {
    setState('overview')
  }
  return (
    <>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(addDocuments.general.heading)}
      </Text>
      <Text variant="default" marginBottom={5}>
        {formatMessage(addDocuments.general.description)}
      </Text>
      {hasMissingInjuryCertificate(application.answers) && (
        <FileUploadController
          application={application}
          id="attachments.injuryCertificateFile"
          accept={UPLOAD_ACCEPT}
          header={formatMessage(addDocuments.injuryCertificate.uploadHeader)}
          description={formatMessage(addDocuments.general.uploadDescription)}
          buttonLabel={formatMessage(addDocuments.general.uploadButtonLabel)}
        />
      )}
      <Box marginTop={5} paddingBottom={10}>
        <Text variant="default" marginBottom={5}>
          Ef þú hefur auka skjöl sem þú villt koma til skila eins og ljósmyndir
          af slysstað, skýrsla til vinnueftirlitsins eða önnnur gögn teng
          slysinu, þá vinsamlegast bættu þeim við hér að neðan.
        </Text>
        <FileUploadController
          application={application}
          id="attachments.additionalFiles"
          accept={UPLOAD_ACCEPT}
          header={formatMessage(addDocuments.general.uploadHeader)}
          description={formatMessage(addDocuments.general.uploadDescription)}
          buttonLabel={formatMessage(addDocuments.general.uploadButtonLabel)}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          Til baka
        </Button>
        <Button icon="arrowForward" onClick={onForwardButtonClick}>
          Halda áfram
        </Button>
      </Box>
    </>
  )
}
