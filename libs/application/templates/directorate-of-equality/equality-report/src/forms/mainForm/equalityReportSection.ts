import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const equalityReportSection = buildSection({
  id: 'equalityReport',
  title: messages.equalityReport.section.sectionTitle,
  children: [
    buildSubSection({
      id: 'previousEqualityPlan',
      title: messages.equalityReport.previousEqualityPlan.sectionTitle,
      condition: (_answers, externalData) =>
        getValueViaPath(
          externalData,
          'activeEqualityReport.data.hasActiveEqualityReport',
        ) === true,
      children: [
        buildMultiField({
          id: 'previousEqualityPlanMultiField',
          title: messages.equalityReport.previousEqualityPlan.title,
          description: messages.equalityReport.previousEqualityPlan.intro,
          children: [
            buildDescriptionField({
              id: 'previousEqualityPlan.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'information',
      title: messages.equalityReport.information.sectionTitle,
      children: [
        buildMultiField({
          id: 'informationMultiField',
          title: messages.equalityReport.information.title,
          description: messages.equalityReport.information.intro,
          children: [
            buildDescriptionField({
              id: 'information.placeholder',
              title: '',
              description: '',
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
            buildDescriptionField({
              id: 'goalsAndActions.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
