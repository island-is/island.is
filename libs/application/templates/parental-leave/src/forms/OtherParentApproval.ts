import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildKeyValueField,
  YES,
} from '@island.is/application/core'
import { Form, FormModes, Application } from '@island.is/application/types'

import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { otherParentApprovalFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getBeginningOfMonth3MonthsAgo,
} from '../lib/parentalLeaveUtils'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  title: otherParentApprovalFormMessages.formTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'review',
      title: otherParentApprovalFormMessages.reviewSection,
      children: [
        buildMultiField({
          id: 'multi',
          title: (application: Application) => {
            const { isRequestingRights, usePersonalAllowanceFromSpouse } =
              getApplicationAnswers(application.answers)

            if (
              isRequestingRights === YES &&
              usePersonalAllowanceFromSpouse === YES
            ) {
              return otherParentApprovalFormMessages.requestBoth
            }

            if (isRequestingRights === YES) {
              return otherParentApprovalFormMessages.requestRights
            }

            return otherParentApprovalFormMessages.requestAllowance
          },
          description: (application: Application) => {
            const { isRequestingRights, usePersonalAllowanceFromSpouse } =
              getApplicationAnswers(application.answers)

            if (
              isRequestingRights === YES &&
              usePersonalAllowanceFromSpouse === YES
            ) {
              return otherParentApprovalFormMessages.introDescriptionBoth
            }

            if (isRequestingRights === YES) {
              return otherParentApprovalFormMessages.introDescriptionRights
            }

            return otherParentApprovalFormMessages.introDescriptionAllowance
          },
          children: [
            buildKeyValueField({
              label: otherParentApprovalFormMessages.labelDays,
              width: 'half',
              condition: (answers) =>
                getApplicationAnswers(answers).isRequestingRights === YES,
              value: (application: Application) =>
                getApplicationAnswers(
                  application.answers,
                ).requestDays.toString(),
            }),
            buildKeyValueField({
              label: otherParentApprovalFormMessages.labelPersonalDiscount,
              width: 'half',
              condition: (answers) =>
                getApplicationAnswers(answers)
                  .usePersonalAllowanceFromSpouse === YES,
              value: (application: Application) => {
                const { spouseUseAsMuchAsPossible, spouseUsage } =
                  getApplicationAnswers(application.answers)

                if (spouseUseAsMuchAsPossible === YES) {
                  return '100%'
                }

                return `${spouseUsage}%`
              },
            }),
            buildDescriptionField({
              id: 'final',
              title: otherParentApprovalFormMessages.warning,
              titleVariant: 'h4',
              description: otherParentApprovalFormMessages.startDateInThePast,
              condition: (answers) => {
                const beginningOfMonth3MonthsAgo =
                  getBeginningOfMonth3MonthsAgo()
                const startDateTime = new Date(
                  getApplicationAnswers(answers).periods[0].startDate,
                ).getTime()

                return startDateTime < beginningOfMonth3MonthsAgo.getTime()
              },
            }),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonSubmit,
              placement: 'footer',
              actions: [
                {
                  name: coreMessages.buttonReject,
                  type: 'reject',
                  event: 'REJECT',
                },
                {
                  name: coreMessages.buttonApprove,
                  type: 'primary',
                  event: 'APPROVE',
                  condition: (answers) => {
                    const beginningOfMonth3MonthsAgo =
                      getBeginningOfMonth3MonthsAgo()
                    const startDateTime = new Date(
                      getApplicationAnswers(answers).periods[0].startDate,
                    ).getTime()

                    return startDateTime >= beginningOfMonth3MonthsAgo.getTime()
                  },
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
