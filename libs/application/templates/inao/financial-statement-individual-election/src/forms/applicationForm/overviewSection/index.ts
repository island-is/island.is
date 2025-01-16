import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ABOUTIDS, GREATER, LESS } from '../../../lib/utils/constants'
import { m } from '../../../lib/utils/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: (application) => {
    return getValueViaPath(application.answers, 'election.incomeLimit') === LESS
      ? m.statement
      : m.overviewSectionTitle
  },
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        return getValueViaPath(application.answers, 'election.incomeLimit') ===
          LESS
          ? m.statement
          : m.overviewReview
      },
      description: (application) => {
        return getValueViaPath(application.answers, 'election.incomeLimit') ===
          GREATER
          ? m.overviewDescription
          : `${m.electionStatement.defaultMessage} ${getValueViaPath(
              application.answers,
              ABOUTIDS.genitiveName,
            )}`
      },
      children: [
        buildCustomField({
          id: 'overviewField',
          condition: (answers) =>
            getValueViaPath(answers, 'election.incomeLimit') === GREATER,
          doesNotRequireAnswer: true,
          component: 'Overview',
        }),
        buildCustomField({
          id: 'overviewStatementField',
          condition: (answers) =>
            getValueViaPath(answers, 'election.incomeLimit') === LESS,
          doesNotRequireAnswer: true,
          component: 'ElectionStatement',
        }),
      ],
    }),
  ],
})
