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
  getValueViaPath,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { YES } from '../constants'
import { otherParentApprovalFormMessages } from '../lib/messages'
import { Boolean } from '../types'

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
          title: (application: Application) => {
            const isRequestingRights = getValueViaPath(
              application.answers,
              'requestRights.isRequestingRights',
            ) as Boolean
            const usePersonalAllowanceFromSpouse = getValueViaPath(
              application.answers,
              'usePersonalAllowanceFromSpouse',
            ) as Boolean

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
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              description: (application: Application) => {
                const isRequestingRights = getValueViaPath(
                  application.answers,
                  'requestRights.isRequestingRights',
                ) as Boolean
                const usePersonalAllowanceFromSpouse = getValueViaPath(
                  application.answers,
                  'usePersonalAllowanceFromSpouse',
                ) as Boolean

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
