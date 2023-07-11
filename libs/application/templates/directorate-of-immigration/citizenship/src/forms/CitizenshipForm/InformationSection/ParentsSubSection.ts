import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'
import { ResidenceCondition } from '@island.is/clients/directorate-of-immigration/citizenship'
import { Routes } from '../../../lib/constants'

export const ParentsSubSection = buildSubSection({
  id: Routes.PARENTINFORMATION,
  title: information.labels.parents.subSectionTitle,
  condition: (_, externalData) => {
    const residenceConditionOptions = getValueViaPath(
      externalData,
      'residenceConditions.data',
      [],
    ) as ResidenceCondition[]

    return residenceConditionOptions.length === 0
  },
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
