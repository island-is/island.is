import { useMutation } from '@apollo/client'
import {
  Application,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  DefaultEvents,
} from '@island.is/application/core'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import { Box, Button, Divider, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FileUploadController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { MouseEventHandler } from 'react-router/node_modules/@types/react'
import { UPLOAD_ACCEPT } from '../../constants'
import { addDocuments, inReview } from '../../lib/messages'
import { hasMissingInjuryCertificate } from '../../utils'

type UploadAttachmentsInReviewProps = {
  application: Application
  setState: React.Dispatch<React.SetStateAction<string>>
  refetch?: () => void
}

export const UploadStuff: FC<UploadAttachmentsInReviewProps> = ({
  application,
  setState,
}) => {
  console.log(application)
  return (
    <Box>
      <Text variant="h1">Bingo DIngo</Text>
    </Box>
  )
  // console.log('UploadAttachmentsInReview', application)
  // const { formatMessage, locale } = useLocale()

  // const onBackButtonClick = () => {
  //   setState('inReviewSteps')
  // }
  // const [submitApplication, { loading }] = useMutation(SUBMIT_APPLICATION, {
  //   onError: (data) => {
  //     toast.error(formatMessage(data?.message || 'Villa'))
  //   },
  // })
  // const [updateApplication, { loading: updateLoading }] = useMutation(
  //   UPDATE_APPLICATION,
  //   {
  //     onError: (data) => {
  //       toast.error(formatMessage(data?.message || 'Villa'))
  //     },
  //   },
  // )
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onSendAttachmentsButtonClick = async () => {
  //   const updateRes = await updateApplication({
  //     variables: {
  //       input: {
  //         id: application.id,
  //         answers: application.answers,
  //       },
  //       locale,
  //     },
  //   })
  //   console.log('updateRes', updateRes)
  //   return
  //   const res = await submitApplication({
  //     variables: {
  //       input: {
  //         id: application.id,
  //         event: DefaultEvents.SUBMIT,
  //         answers: application.answers,
  //       },
  //     },
  //   })
  //   if (res?.data) {
  //     console.log(res.data)
  //     // setState('inReviewSteps')
  //   }
  // }
  // return (
  //   <Box onSubmit={onSendAttachmentsButtonClick}>
  //     <Text variant="h1" marginBottom={2}>
  //       {formatMessage(addDocuments.general.heading)}
  //     </Text>
  //     <Text variant="default" marginBottom={5}>
  //       {formatMessage(addDocuments.general.description)}
  //     </Text>

  //     <FileUploadController
  //       application={application}
  //       id="attachments.injuryCertificateFile.file"
  //       accept={UPLOAD_ACCEPT}
  //       header={formatMessage(addDocuments.injuryCertificate.uploadHeader)}
  //       description={formatMessage(addDocuments.general.uploadDescription)}
  //       buttonLabel={formatMessage(addDocuments.general.uploadButtonLabel)}
  //     />

  //     <Box marginTop={5} paddingBottom={10}>
  //       <Text variant="default" marginBottom={5}>
  //         {formatMessage(addDocuments.general.additionalDocumentsDescription)}
  //       </Text>
  //       <FileUploadController
  //         application={application}
  //         id="attachments.additionalFiles"
  //         accept={UPLOAD_ACCEPT}
  //         header={formatMessage(addDocuments.general.uploadHeader)}
  //         description={formatMessage(addDocuments.general.uploadDescription)}
  //         buttonLabel={formatMessage(addDocuments.general.uploadButtonLabel)}
  //       />
  //     </Box>
  //     <Divider />
  //     <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
  //       <Button variant="ghost" onClick={onBackButtonClick} disabled={loading}>
  //         {formatMessage(inReview.buttons.backButton)}
  //       </Button>
  //       <Button
  //         onClick={onSendAttachmentsButtonClick}
  //         icon="checkmarkCircle"
  //         loading={loading}
  //       >
  //         {formatMessage(inReview.buttons.sendAttachmentsButton)}
  //       </Button>
  //     </Box>
  //   </Box>
  // )
}

export const UploadAttachmentsInReview = buildSubSection({
  id: 'somethingCoolSubsection',
  title: 'UploadStuff',
  children: [
    buildMultiField({
      id: 'powerOfAttorney',
      title: 'Bingo DIngo',
      description: 'Bingo DIngo',
      children: [
        buildFileUploadField({
          id: 'attachments.injuryCertificateFile.file',
          title: '',
          introduction: '',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: 'powerOfAttorney.upload.uploadHeader',
          uploadDescription: 'powerOfAttorney.upload.uploadDescription',
          uploadButtonLabel: 'powerOfAttorney.upload.uploadButtonLabel',
        }),
      ],
    }),
  ],
})
