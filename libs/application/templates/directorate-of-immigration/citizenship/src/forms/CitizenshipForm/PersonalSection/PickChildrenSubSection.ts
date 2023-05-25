import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildAlertMessageField,
  buildMessageWithLinkButtonField
} from '@island.is/application/core'
import { personal, selectChildren } from '../../../lib/messages'

export const PickChildrenSubSection = buildSubSection({
  id: 'pickChildren',
  title: personal.labels.pickChildren.subSectionTitle,
  children: [
    buildMultiField({
      id: 'pickChildrenMultiField',
      title: personal.labels.pickChildren.pageTitle,
      description: personal.labels.pickChildren.description,
      children: [
        buildAlertMessageField({
          id: 'attentionAgeChildren',
          title: selectChildren.warningAgeChildren.title,
          message: selectChildren.warningAgeChildren.information,
          alertType:"warning"
        }),
        buildCustomField({
          id: 'selectedChildren',
          title: personal.labels.pickChildren.pageTitle,
          component: 'SelectChildren',
        }),
        buildCustomField({
          id: 'generalMessage',
          title: 'Upplýsingar',
          component: 'InformationBoxWithLink'
        })
      ],
    }),
  ],
})
