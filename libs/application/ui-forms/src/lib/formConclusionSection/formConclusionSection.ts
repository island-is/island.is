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
  alertMessage: MessageDescriptor
  bulletHeader: MessageDescriptor
  bulletIntro: MessageDescriptor
  bulletPoints: StaticText
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
            title: type.bulletHeader,
            introText: type.bulletIntro,
            description: type.bulletPoints,
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
