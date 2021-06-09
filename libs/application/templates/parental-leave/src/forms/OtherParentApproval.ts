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
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { YES } from '../constants'
import { otherParentApprovalFormMessages } from '../lib/messages'
import { getApplicationAnswers } from '../lib/parentalLeaveUtils'

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
          title: otherParentApprovalFormMessages.multiTitle,
          description: otherParentApprovalFormMessages.introDescription,
          children: [
            buildKeyValueField({
              label: otherParentApprovalFormMessages.labelDays,
              width: 'half',
              condition: (answers) =>
                getApplicationAnswers(answers).isRequestingRights === YES,
              // TODO: update when requested days are no longer a binary choice
              // defaultValue: (application: Application) => getApplicationAnswers(application.answers).requestDays
              value: '45',
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
