import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, Button, Text, PdfViewer } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import {
  AlertMessageFormField,
  MessageWithLinkButtonFormField,
  PdfLinkButtonFormField,
} from '@island.is/application/ui-fields'
import { coreMessages, formatText } from '@island.is/application/core'
import * as styles from './styles.css'
import { confirmation } from '../../lib/messages'
import { getProfessionName } from '../../utils/getProfessionName'
import { conclusionMessages } from '@island.is/application/ui-forms'

export const CustomFormConclusionSectionField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const [fileToView, setFileToView] = useState<
    | {
        base64: string
        filename: string
      }
    | undefined
  >(undefined)

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
              base64: string
              professionId: string
            }[]

            return data.map((x) => ({
              base64: x.base64,
              customButtonText: getProfessionName(
                application.externalData,
                x.professionId,
              ),
              filename: 'vottord_vegna_starfsleyfis_' + x.professionId + '.pdf',
            }))
          },
          setViewPdfFile: (file: { base64: string; filename: string }) => {
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
