import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, Button, Text, PdfViewer } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import {
  AlertMessageFormField,
  MessageWithLinkButtonFormField,
  PdfLinkButtonFormField,
} from '@island.is/application/ui-fields'
import { coreMessages, formatText } from '@island.is/application/core'
import * as styles from './styles.css'
import { confirmation } from '../../lib/messages'
import { conclusionMessages } from '@island.is/application/ui-forms'
import { PermitProgram } from '../../lib'
import { HealthcareWorkPermitAnswers } from '../..'
import format from 'date-fns/format'

interface PdfFile {
  base64: string
  filename: string
}

export const CustomFormConclusionSectionField = (props: FieldBaseProps) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const [fileToView, setFileToView] = useState<PdfFile | undefined>(undefined)

  if (fileToView) {
    return (
      <>
        <Box
          display="flex"
          marginBottom={5}
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <Button
            circle
            icon="arrowBack"
            onClick={() => {
              setFileToView(undefined)
            }}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={`data:application/pdf;base64,${fileToView.base64}`}
            download={fileToView.filename}
            className={styles.linkWithoutDecorations}
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatText(
                conclusionMessages.pdfLinkButtonField.downloadButtonTitle,
                application,
                formatMessage,
              )}
            </Button>
          </a>
        </Box>

        <PdfViewer file={`data:application/pdf;base64,${fileToView.base64}`} />
      </>
    )
  }

  const answers = props.application.answers as HealthcareWorkPermitAnswers

  const permitPrograms = props.application.externalData.permitOptions
    ?.data as PermitProgram[]
  if (!permitPrograms) {
    throw new Error('Permit programs data is missing.')
  }

  const chosenProgram = permitPrograms.find(
    (program) => program.programId === answers.selectWorkPermit.programId,
  )

  return (
    <>
      <Text variant="h1" marginBottom={3}>
        {formatMessage(confirmation.general.pageTitle)}
      </Text>
      <AlertMessageFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.ALERT_MESSAGE,
          component: FieldComponents.ALERT_MESSAGE,
          title: confirmation.general.alertTitle,
          alertType: 'success',
          message: confirmation.general.alertMessage,
        }}
      />
      <PdfLinkButtonFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.PDF_LINK_BUTTON,
          component: FieldComponents.PDF_LINK_BUTTON,
          verificationDescription:
            conclusionMessages.pdfLinkButtonField.verificationDescription,
          verificationLinkTitle:
            conclusionMessages.pdfLinkButtonField.verificationLinkTitle,
          verificationLinkUrl:
            conclusionMessages.pdfLinkButtonField.verificationLinkUrl,
          getPdfFiles: (application) => {
            const data = application.externalData.submitApplication.data as {
              base64String: string
            }[]
            const formattedDate = format(new Date(), 'yyyy-MM-dd')
            // This should only ever be at most 2 files, in order license -> license number (when license number is applicable)
            return data.map((x, index) => ({
              base64: x.base64String,
              customButtonText: {
                is:
                  index === 0
                    ? `Starfsleyfi - ${chosenProgram?.name}`
                    : `Leyfisnúmer`,
                en: index === 0 ? `License to practice` : `License number`,
              },
              filename:
                index === 0
                  ? `starfsleyfi_${formattedDate}.pdf`
                  : `leyfisnumer_${formattedDate}.pdf`,
            }))
          },
          setViewPdfFile: (file: PdfFile) => {
            setFileToView(file)
          },
        }}
      />
      <MessageWithLinkButtonFormField
        application={application}
        field={{
          ...props.field,
          type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
          component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
        }}
      />
    </>
  )
}
