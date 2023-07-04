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

export const ParentsSubSection = buildSubSection({
  id: 'parentInformation',
  title: information.labels.parents.subSectionTitle,
  condition: (_, externalData) => {
    const residenceConditionOptions = getValueViaPath(
      externalData,
      'residenceConditions.data',
      [],
    ) as ResidenceCondition[]
    //TODO SWITCH RETURN
    return true
    //return residenceConditionOptions.length === 0
  },
  children: [
    buildMultiField({
      id: 'parentsMultiField',
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
