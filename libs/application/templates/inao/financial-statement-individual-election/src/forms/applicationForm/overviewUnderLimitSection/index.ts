import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { ABOUTIDS, ELECTIONLIMIT } from '../../../utils/constants'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { isLessThanIncomeLimit } from '../../../utils/conditions'
import { format as formatNationalId } from 'kennitala'
import { formatCurrency } from '@island.is/application/ui-components'

export const overviewUnderLimitSection = buildSection({
  condition: isLessThanIncomeLimit,
  id: 'overviewUnderLimitSection',
  title: m.statement,
  children: [
    buildMultiField({
      id: 'overviewUnderLimitMultiField',
      title: m.statement,
      children: [
        buildDescriptionField({
          id: 'overviewStatementDescription',
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
        }),
        buildDescriptionField({
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
          id: 'overviewStatementDescription',
          description: m.electionStatementLaw,
        }),
        buildAlertMessageField({
          id: 'overviewStatementDescription2',
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
