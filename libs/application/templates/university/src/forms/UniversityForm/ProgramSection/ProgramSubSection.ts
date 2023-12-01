import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const ProgramSubSection = buildSubSection({
  id: Routes.PROGRAMINFORMATION,
  title: information.labels.programSelection.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PROGRAMINFORMATION,
      title: information.labels.programSelection.title,
      children: [
        buildDescriptionField({
          id: `${Routes.PROGRAMINFORMATION}.title`,
          title: information.labels.programSelection.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
