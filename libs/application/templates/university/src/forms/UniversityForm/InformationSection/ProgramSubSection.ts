import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
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
      description: information.labels.programSelection.subTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.PROGRAMINFORMATION}.selectTitle`,
          title: information.labels.programSelection.selectProgramTitle,
          titleVariant: 'h5',
        }),
        buildCustomField({
          id: Routes.PROGRAMINFORMATION,
          title: '',
          component: 'ProgramSelection',
        }),
      ],
    }),
  ],
})
