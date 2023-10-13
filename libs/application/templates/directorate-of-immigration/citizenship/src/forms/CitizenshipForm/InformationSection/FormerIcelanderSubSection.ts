import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  NO,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'

export const FormerIcelanderSubSection = buildSubSection({
  id: 'formerIcelander',
  title: information.labels.formerIcelander.subSectionTitle,
  children: [
    buildMultiField({
      id: 'formerIcelanderMultiField',
      title: information.labels.formerIcelander.pageTitle,
      description: information.labels.formerIcelander.description,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship
        return answers?.parentInformation?.hasValidParents === NO
      },
      children: [
        buildCustomField({
          id: 'formerIcelander',
          title: '',
          description: '',
          component: 'FormerIcelander',
        }),
      ],
    }),
  ],
})
