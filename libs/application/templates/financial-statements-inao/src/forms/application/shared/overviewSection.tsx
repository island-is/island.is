import {
  buildCustomField,
  buildMultiField,
  buildSection,
  DefaultEvents,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { GREATER, LESS } from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',

      title: (application) =>
        getValueViaPath(application.answers, 'electionInfo.incomeLimit') ===
        GREATER
          ? m.overviewTitle
          : m.statement,
      description: (application) =>
      getValueViaPath(application.answers, 'electionInfo.incomeLimit') === GREATER
          ? m.overviewDescription
          : m.electionStatement,
      children: [
        buildCustomField({
          id: 'overviewCustomField',
          title: '',
          condition: (answers) =>
            getValueViaPath(answers, 'electionInfo.incomeLimit') === GREATER,
          doesNotRequireAnswer: true,
          component: 'Overview',
        }),
        buildCustomField({
          id: 'overviewStatementField',
          title: '',
          condition: (answers) => getValueViaPath(answers, 'electionInfo.incomeLimit') === LESS,
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
