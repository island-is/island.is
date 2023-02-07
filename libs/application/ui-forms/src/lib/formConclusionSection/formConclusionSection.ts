import {
  buildSection,
  buildMultiField,
  buildAlertMessageField,
  buildExpandableDescriptionField,
  buildMessageWithLinkButtonField,
  buildS3PdfLinkField,
} from '@island.is/application/core'
import { FormText } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { StaticText } from 'static-text'
import { conclusion } from './messages'

type props = {
  alertTitle: MessageDescriptor
  alertMessage?: MessageDescriptor
  expandableHeader: MessageDescriptor
  expandableIntro?: MessageDescriptor
  expandableDescription: StaticText
  s3PdfKey?: FormText
  pdfButtonText?: MessageDescriptor
}

export const formConclusionSection = (type: props) =>
  buildSection({
    id: 'uiForms.conclusionSection',
    title: conclusion.information.sectionTitle,
    children: [
      buildMultiField({
        id: 'uiForms.conclusionMultifield',
        title: conclusion.information.formTitle,
        children: [
          buildAlertMessageField({
            id: 'uiForms.conclusionAlert',
            title: type.alertTitle,
            alertType: 'success',
            message: type.alertMessage,
          }),
          buildS3PdfLinkField({
            id: 'uiForms.complaintLink',
            title: type.pdfButtonText ?? '',
            s3key: type.s3PdfKey ?? '',
            condition: () => {
              return (
                type.s3PdfKey !== undefined && type.pdfButtonText !== undefined
              )
            },
          }),
          buildExpandableDescriptionField({
            id: 'uiForms.conclusionBullet',
            title: type.expandableHeader,
            introText: type.expandableIntro,
            description: type.expandableDescription,
            startExpanded: true,
          }),
          buildMessageWithLinkButtonField({
            id: 'uiForms.conclusionGoToServicePortal',
            title: '',
            url: '/minarsidur',
            buttonTitle: conclusion.information.buttonTitle,
            message: conclusion.information.messageText,
          }),
        ],
      }),
    ],
  })
