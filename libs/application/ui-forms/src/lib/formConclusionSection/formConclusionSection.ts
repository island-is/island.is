import {
  buildSection,
  buildMultiField,
  buildAlertMessageField,
  buildExpandableDescriptionField,
  buildMessageWithLinkButtonField,
  buildLinkField,
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
  link?: string
  buttonText?: MessageDescriptor
}

/**
 * Creates a form conclusion section for applications
 * so the developer doesn't have to write the same code over and over again.
 *
 * @param  alertTitle  Title of the green alert message.
 * @param  alertMessage The message inside the green alert box.
 * @param  expandableHeader Header of the expandable description section.
 * @param  expandableIntro Intro text of the expandable description section.
 * @param  expandableDescription Markdown code for the expandable description section, most applications use bulletpoints.
 * @param  s3PdfKey The key of the pdf file in s3.
 * @param  link Link that user can click on.
 * @param  buttonText The text of the button that links to a url
 */
export const formConclusionSection = (props: props) =>
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
            title: props.alertTitle,
            alertType: 'success',
            message: props.alertMessage,
          }),
          buildLinkField({
            id: 'uiForms.complaintLink',
            title: props.buttonText ?? '',
            s3key: props.s3PdfKey ?? '',
            link: props.link ?? '',
            condition: () => {
              return props.buttonText !== undefined
            },
          }),
          buildExpandableDescriptionField({
            id: 'uiForms.conclusionBullet',
            title: props.expandableHeader,
            introText: props.expandableIntro,
            description: props.expandableDescription,
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
