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
      id: 'eldriJafnrettisaetlun',
      title: messages.equalityReport.eldriJafnrettisaetlun.sectionTitle,
      condition: (_answers, externalData) =>
        getValueViaPath(
          externalData,
          'activeEqualityReport.data.hasActiveEqualityReport',
        ) === true,
      children: [
        buildMultiField({
          id: 'eldriJafnrettisaetlunMultiField',
          title: messages.equalityReport.eldriJafnrettisaetlun.title,
          description: messages.equalityReport.eldriJafnrettisaetlun.intro,
          children: [
            buildDescriptionField({
              id: 'eldriJafnrettisaetlun.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'uplysingar',
      title: messages.equalityReport.uplysingar.sectionTitle,
      children: [
        buildMultiField({
          id: 'uplysingarMultiField',
          title: messages.equalityReport.uplysingar.title,
          description: messages.equalityReport.uplysingar.intro,
          children: [
            buildDescriptionField({
              id: 'uplysingar.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'markmidOgAdgerdir',
      title: messages.equalityReport.markmidOgAdgerdir.sectionTitle,
      children: [
        buildMultiField({
          id: 'markmidOgAdgerdirMultiField',
          title: messages.equalityReport.markmidOgAdgerdir.title,
          description: messages.equalityReport.markmidOgAdgerdir.intro,
          children: [
            buildDescriptionField({
              id: 'markmidOgAdgerdir.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
