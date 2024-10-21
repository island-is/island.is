import {
  buildCustomField,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { GREATER, LESS } from '../../../../../../shared/utils/constants'

export const overviewMultiField = buildMultiField({
  id: 'overview',
  title: m.yearlyOverview,
  description: m.review,
  children: [
    buildCustomField({
      id: 'overviewPartyField',
      title: '',
      doesNotRequireAnswer: true,
      component: 'PartyOverview',
    }),
    buildCustomField({
      id: 'overviewField',
      title: '',
      condition: (answers) =>
        getValueViaPath(answers, 'election.incomeLimit') === GREATER,
      doesNotRequireAnswer: true,
      component: 'Overview',
    }),
    buildCustomField({
      id: 'overviewStatementField',
      title: '',
      condition: (answers) =>
        getValueViaPath(answers, 'election.incomeLimit') === LESS,
      doesNotRequireAnswer: true,
      component: 'ElectionStatement',
    }),
  ],
})
