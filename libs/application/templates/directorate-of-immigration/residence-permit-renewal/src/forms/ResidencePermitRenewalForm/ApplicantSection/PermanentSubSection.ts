import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'

export const PermanentSubSection = buildSubSection({
  id: 'permanent',
  title: applicant.labels.permanent.subSectionTitle,
  children: [
    buildMultiField({
      id: 'permanentMultiField',
      title: applicant.labels.permanent.pageTitle,
      description: applicant.labels.permanent.description,
      children: [
        buildDescriptionField({
          id: 'permanent.title',
          title: applicant.labels.permanent.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
