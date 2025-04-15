import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: userInformation.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'TODOx Lorem ipsum',
        }),
      ],
    }),
  ],
})
