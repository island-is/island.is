import {
  buildCustomField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const subSectionDelegate = buildSubSection({
  id: 'delegate',
  title: '',
  condition: (answers) =>
    !!getValueViaPath(answers, 'electPerson.electedPersonName'),
  children: [
    buildCustomField({
      condition: (answers) =>
        !!getValueViaPath(answers, 'electPerson.electedPersonName'),
      title: '',
      component: 'SubmitAndDelegate',
      id: 'subSectionDelegate',
    }),
  ],
})
