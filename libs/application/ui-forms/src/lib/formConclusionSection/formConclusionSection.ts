import {
  buildSection,
  buildMultiField,
  buildAlertMessageField,
  buildExpandableDescriptionField,
  buildMessageWithLinkButtonField,
} from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'
import { StaticText } from 'static-text'
import { conclusion } from './messages'

type props = {
  alertTitle: MessageDescriptor
  alertMessage?: MessageDescriptor
  expandableHeader: MessageDescriptor
  expandableIntro?: MessageDescriptor
  expandableDescription: StaticText
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
