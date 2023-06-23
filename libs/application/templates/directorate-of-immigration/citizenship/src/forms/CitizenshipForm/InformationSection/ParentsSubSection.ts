import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'

export const ParentsSubSection = buildSubSection({
  id: 'parents',
  title: information.labels.parents.subSectionTitle,
  children: [
    buildMultiField({
      id: 'parentsMultiField',
      title: information.labels.parents.pageTitle,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship

        //TODO breyta mv uppfærða hönnun
        if (answers.residenceCondition?.radio === '20092') {
          return true
        }
        return false
      },
      children: [
        buildCustomField({
          id: 'parents',
          title: '',
          description: '',
          component: 'Parents',
        }),
      ],
    }),
  ],
})
