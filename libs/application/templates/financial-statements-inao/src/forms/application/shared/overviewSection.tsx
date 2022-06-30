import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { CEMETRY, GREATER, LESS, PARTY } from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        return getValueViaPath(application.answers, 'election.incomeLimit') ===
          LESS
          ? m.statement
          : m.overviewTitle
      },
      description: (application) =>
        getValueViaPath(application.answers, 'election.incomeLimit') === LESS
          ? m.overviewDescription
          : `${m.electionStatement.defaultMessage} ${getValueViaPath(
              application.answers,
              'election.selectElection',
            )}`,
      children: [
        buildCustomField({
          id: 'overviewCustomField',
          title: '',
          condition: (answers, externalData) => {
            console.log({ externalData, answers })
            const userType = externalData?.currentUserType?.data?.code
            return userType === CEMETRY
          },
          doesNotRequireAnswer: true,
          component: 'CemetryOverview',
        }),
        buildCustomField({
          id: 'overviewCustomField',
          title: '',
          condition: (_answers, externalData) => {
            console.log(externalData)
            const userType = externalData?.currentUserType?.data?.code
            return userType === PARTY
          },
          doesNotRequireAnswer: true,
          component: 'PartyOverview',
        }),
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
