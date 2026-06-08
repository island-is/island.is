import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildLinkField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTitleField,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const equalityReportSection = buildSection({
  id: 'equalityReport',
  title: messages.equalityReport.section.sectionTitle,
  children: [
    buildSubSection({
      id: 'information',
      title: messages.equalityReport.information.sectionTitle,

      children: [
        buildMultiField({
          id: 'informationMultiField',
          title: messages.equalityReport.information.title,
          description: messages.equalityReport.information.intro,
          children: [
            buildLinkField({
              id: 'information.link',
              title: messages.equalityReport.information.detailLinkLabel,
              link: messages.equalityReport.information.detailLink,
              variant: 'text',
            }),
            buildTitleField({
              title: messages.equalityReport.information.listTitle,
              marginBottom: 1,
            }),
            buildDescriptionField({
              id: 'information.placeholder',
              description: messages.equalityReport.information.list,
              marginBottom: 3,
            }),
            buildCheckboxField({
              id: 'information.checkbox',
              options: [
                {
                  label: messages.equalityReport.information.checkboxLabel,
                  value: 'agree',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'goalsAndActions',
      title: messages.equalityReport.goalsAndActions.sectionTitle,
      children: [
        buildMultiField({
          id: 'goalsAndActionsMultiField',
          title: messages.equalityReport.goalsAndActions.title,
          description: messages.equalityReport.goalsAndActions.intro,
          children: [
            buildLinkField({
              id: 'goalsAndActions.link',
              title: messages.equalityReport.information.detailLinkLabel,
              link: messages.equalityReport.information.detailLink,
              variant: 'text',
            }),
            buildDescriptionField({
              id: 'goalsAndActions.placeholder',
              title: '',
              description: '',
            }),
            buildCustomField({
              id: 'information.customField',
              title: '',
              component: 'Editor',
            }),
          ],
        }),
      ],
    }),
  ],
})
