import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'

export const PickApplicantSubSection = buildSubSection({
  id: 'pickApplicant',
  title: applicant.labels.pickApplicant.subSectionTitle,
  children: [
    buildMultiField({
      id: 'pickApplicantMultiField',
      title: applicant.labels.pickApplicant.pageTitle,
      description: applicant.labels.pickApplicant.description,
      children: [
        buildDescriptionField({
          id: 'pickApplicant.title',
          title: applicant.labels.pickApplicant.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
