import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { GREATER, LESS } from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        return getValueViaPath(application.answers, 'election.incomeLimit') ===
          GREATER
          ? m.overviewTitle
          : m.statement
      },
      description: (application) =>
        getValueViaPath(application.answers, 'election.incomeLimit') === GREATER
          ? m.overviewDescription
          : `${m.electionStatement.defaultMessage} ${getValueViaPath(
              application.answers,
              'election.selectElection',
            )}`,
      children: [
        buildCustomField({
          id: 'overviewCustomField',
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
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'screen',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overviewCorrect,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
