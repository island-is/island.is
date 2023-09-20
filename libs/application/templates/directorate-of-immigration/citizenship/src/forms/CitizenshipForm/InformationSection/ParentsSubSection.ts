import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const ParentsSubSection = buildSubSection({
  id: Routes.PARENTINFORMATION,
  title: information.labels.parents.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.PARENTINFORMATION,
      title: information.labels.parents.pageTitle,
      children: [
        buildCustomField({
          id: 'parentInformation',
          title: '',
          description: '',
          component: 'Parents',
        }),
      ],
    }),
  ],
})
