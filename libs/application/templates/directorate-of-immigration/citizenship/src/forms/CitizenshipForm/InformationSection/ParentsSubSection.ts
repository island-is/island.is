import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
  buildCustomField,
} from '@island.is/application/core'
import { information, personal } from '../../../lib/messages'
import { Answer, Application } from '@island.is/application/types'
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
        if (answers.residenceCondition?.radio === 'childOfIcelander') {
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
