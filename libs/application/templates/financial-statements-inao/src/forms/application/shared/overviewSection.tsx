import {
  buildDescriptionField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FinancialStatementsInao } from '../../../lib/utils/dataSchema'
import {
  CEMETRY,
  GREATER,
  INDIVIDUAL,
  LESS,
  PARTY,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        if (
          // @ts-ignore
          application.externalData?.currentUserType?.data?.code === INDIVIDUAL
        ) {
          return getValueViaPath(
            application.answers,
            'election.incomeLimit',
          ) === LESS
            ? m.statement
            : m.overviewReview
        } else {
          return m.yearlyOverview
        }
      },
      description: (application) => {
        if (
          // @ts-ignore
          application.externalData?.currentUserType?.data?.code === INDIVIDUAL
        ) {
          return getValueViaPath(
            application.answers,
            'election.incomeLimit',
          ) === GREATER
            ? m.overviewDescription
            : `${m.electionStatement.defaultMessage} ${getValueViaPath(
                application.answers,
                'election.selectElection',
              )}`
        } else {
          return m.review
        }
      },
      children: [
        buildCustomField({
          id: 'overviewCemetryField',
          title: '',
          condition: (answers, externalData) => {
            /* @ts-ignore */
            const userType = externalData?.currentUserType?.data?.code
            return userType === CEMETRY
          },
          doesNotRequireAnswer: true,
          component: 'CemetryOverview',
        }),
        buildCustomField({
          id: 'overviewPartyField',
          title: '',
          condition: (_answers, externalData) => {
            /* @ts-ignore */
            const userType = externalData?.currentUserType?.data?.code
            return userType === PARTY
          },
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
        buildDescriptionField({
          id: 'overviewConfirmations',
          title: m.overview,
          titleVariant: 'h3',
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
