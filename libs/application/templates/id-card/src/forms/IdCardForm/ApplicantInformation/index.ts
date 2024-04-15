import {
  buildMultiField,
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { applicantInformation } from '../../../lib/messages'

export const ApplicanInformationSubSection = buildSection({
  id: Routes.APPLICANTSINFORMATION,
  title: applicantInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.APPLICANTSINFORMATION,
      title: 'TODO',
      children: [
        buildDescriptionField({
          id: `${Routes.APPLICANTSINFORMATION}.title`,
          title: 'todo',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
