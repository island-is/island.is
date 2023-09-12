import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'
import { ResidenceCondition } from '@island.is/clients/directorate-of-immigration'
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
