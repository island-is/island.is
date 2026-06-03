import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const equalityReportSection = buildSection({
  id: 'equalityReport',
  title: messages.equalityReport.section.sectionTitle,
  children: [
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
