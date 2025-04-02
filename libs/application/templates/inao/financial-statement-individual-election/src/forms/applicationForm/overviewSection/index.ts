import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  aboutOverviewItems,
  assetsOverviewItems,
  capitalNumbersOverviewItems,
  debtsAndCashOverviewItems,
  debtsOverviewItems,
  expensesOverviewItems,
  fileOverviewItems,
  incomeOverviewItems,
} from '../../../utils/overviewItems'
import { ABOUTIDS, ELECTIONLIMIT, LESS } from '../../../utils/constants'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { isLessThanIncomeLimit } from '../../../utils/conditions'
import { isGreaterThanIncomeLimit } from '../../../utils/conditions'
import { format as formatNationalId } from 'kennitala'
import { formatCurrency } from '@island.is/application/ui-components'
import { application } from 'express'

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
      children: [
        buildDescriptionField({
          condition: isGreaterThanIncomeLimit,
          id: 'overviewDescription',
          description: m.overviewDescription,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'aboutOverviewField',
          title: m.aboutOverviewTitle,
          items: aboutOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'incomeOverviewField',
          title: m.income,
          items: incomeOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'expensesOverviewField',
          title: m.expenses,
          items: expensesOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'capitalNumbersOverviewField',
          title: m.capitalNumbers,
          items: capitalNumbersOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'assetsOverviewField',
          title: m.properties,
          items: assetsOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'debtsOverviewField',
          title: m.debts,
          items: debtsOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'debtsAndCashsOverviewField',
          title: m.debtsAndCash,
          items: debtsAndCashOverviewItems,
        }),
        buildOverviewField({
          condition: isGreaterThanIncomeLimit,
          id: 'fileOverviewField',
          title: m.attachments,
          attachments: fileOverviewItems,
        }),
        buildDescriptionField({
          id: 'overviewStatementField',
          description: (application) => {
            const election = getValueViaPath<string>(
              application.answers,
              ABOUTIDS.genitiveName,
            )

            return {
              ...m.electionStatementDescription,
              values: { election },
            }
          },
          condition: isLessThanIncomeLimit,
        }),
        buildDescriptionField({
          condition: isLessThanIncomeLimit,
          id: 'overviewStatementDescription',
          description: (application) => {
            const { answers } = application
            return {
              ...m.participatedIn,
              values: {
                fullName: getValueViaPath<string>(answers, 'about.fullName'),
                nationalId: formatNationalId(
                  getValueViaPath<string>(answers, 'about.nationalId') ?? '',
                ),
                election: getValueViaPath<string>(
                  answers,
                  'election.genitiveName',
                ),
              },
            }
          },
        }),
        buildDescriptionField({
          condition: isLessThanIncomeLimit,
          id: 'overviewStatementDescription',
          description: (_application) => {
            // TODO: add the income limit to answers when it is fetched

            return {
              ...m.electionDeclare,
              values: { incomeLimit: formatCurrency(ELECTIONLIMIT.toString()) },
            }
          },
        }),
        buildDescriptionField({
          condition: isLessThanIncomeLimit,
          id: 'overviewStatementDescription',
          description: m.electionStatementLaw,
        }),
        buildAlertMessageField({
          condition: isLessThanIncomeLimit,
          id: 'overviewStatementField',
          title: m.signatureTitle,
          message: (application) => {
            return {
              ...m.signatureMessage,
              values: {
                email: getValueViaPath<string>(
                  application.answers,
                  'about.email',
                ),
              },
            }
          },
          alertType: 'info',
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'approveOverview',
          options: [{ label: m.overviewCorrect, value: YES }],
        }),
        buildSubmitField({
          id: 'overviewSubmitField',
          refetchApplicationAfterSubmit: true,
          actions: [
            { event: DefaultEvents.SUBMIT, name: m.send, type: 'primary' },
          ],
        }),
      ],
    }),
  ],
})
