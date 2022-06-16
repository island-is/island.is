import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  coreMessages,
  Application,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { YES } from '../constants'
import { otherParentApprovalFormMessages } from '../lib/messages'
import { currentDateStartTime } from '../lib/parentalLeaveTemplateUtils'
import { getApplicationAnswers } from '../lib/parentalLeaveUtils'
import { YesOrNo } from '../types'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  title: otherParentApprovalFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: otherParentApprovalFormMessages.reviewSection,
      children: [
        buildMultiField({
          id: 'multi',
          condition: (answers) =>
            new Date(
              getApplicationAnswers(answers).periods[0].startDate,
            ).getTime() < currentDateStartTime(),
          title: (application: Application) => {
            const isRequestingRights = getValueViaPath(
              application.answers,
              'requestRights.isRequestingRights',
            ) as YesOrNo
            const usePersonalAllowanceFromSpouse = getValueViaPath(
              application.answers,
              'usePersonalAllowanceFromSpouse',
            ) as YesOrNo

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
            const isRequestingRights = getValueViaPath(
              application.answers,
              'requestRights.isRequestingRights',
            ) as YesOrNo
            const usePersonalAllowanceFromSpouse = getValueViaPath(
              application.answers,
              'usePersonalAllowanceFromSpouse',
            ) as YesOrNo

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
                const {
                  spouseUseAsMuchAsPossible,
                  spouseUsage,
                } = getApplicationAnswers(application.answers)

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
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'multi',
          condition: (answers) =>
            new Date(
              getApplicationAnswers(answers).periods[0].startDate,
            ).getTime() >= currentDateStartTime(),
          title: (application: Application) => {
            const isRequestingRights = getValueViaPath(
              application.answers,
              'requestRights.isRequestingRights',
            ) as YesOrNo
            const usePersonalAllowanceFromSpouse = getValueViaPath(
              application.answers,
              'usePersonalAllowanceFromSpouse',
            ) as YesOrNo

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
            const isRequestingRights = getValueViaPath(
              application.answers,
              'requestRights.isRequestingRights',
            ) as YesOrNo
            const usePersonalAllowanceFromSpouse = getValueViaPath(
              application.answers,
              'usePersonalAllowanceFromSpouse',
            ) as YesOrNo

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
                const {
                  spouseUseAsMuchAsPossible,
                  spouseUsage,
                } = getApplicationAnswers(application.answers)

                if (spouseUseAsMuchAsPossible === YES) {
                  return '100%'
                }

                return `${spouseUsage}%`
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
