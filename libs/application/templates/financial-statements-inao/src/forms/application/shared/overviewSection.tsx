import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { GREATER, ABOUTIDS } from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { getCurrentUserType } from '../../../lib/utils/helpers'
import { FSIUSERTYPE, LESS } from '../../../types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        const answers = application.answers
        const externalData = application.externalData
        if (
          getCurrentUserType(answers, externalData) === FSIUSERTYPE.INDIVIDUAL
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
        const answers = application.answers
        const externalData = application.externalData
        if (
          getCurrentUserType(answers, externalData) === FSIUSERTYPE.INDIVIDUAL
        ) {
          return getValueViaPath(
            application.answers,
            'election.incomeLimit',
          ) === GREATER
            ? m.overviewDescription
            : `${m.electionStatement.defaultMessage} ${getValueViaPath(
                application.answers,
                ABOUTIDS.electionName,
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
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.CEMETRY
          },
          doesNotRequireAnswer: true,
          component: 'CemetryOverview',
        }),
        buildCustomField({
          id: 'overviewPartyField',
          title: '',
          condition: (answers, externalData) => {
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.PARTY
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
      ],
    }),
  ],
})
