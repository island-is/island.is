import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const CriminalRecordSubSection = buildSubSection({
  id: 'criminalRecord',
  title: information.labels.criminalRecord.subSectionTitle,
  children: [
    buildMultiField({
      id: 'criminalRecordMultiField',
      title: information.labels.criminalRecord.pageTitle,
      description: information.labels.criminalRecord.description,
      children: [
        buildDescriptionField({
          id: 'criminalRecord.title',
          title: information.labels.criminalRecord.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
