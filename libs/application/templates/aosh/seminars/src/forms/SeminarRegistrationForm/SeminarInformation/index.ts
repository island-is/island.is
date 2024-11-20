import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { seminar as seminarMessages } from '../../../lib/messages'

export const seminarInformationSection = buildSection({
  id: 'seminarInformation',
  title: seminarMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'seminarInformationMultiField',
      title: seminarMessages.general.pageTitle,
      description: seminarMessages.general.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
          title: 'test',
        }),
      ],
    }),
  ],
})
