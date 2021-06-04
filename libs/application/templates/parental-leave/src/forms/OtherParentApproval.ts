import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  coreMessages,
  buildTextField,
  Application,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { YES } from '../constants'
import { otherParentApprovalFormMessages } from '../lib/messages'
import { getApplicationAnswers } from '../parentalLeaveUtils'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  // title: otherParentApprovalFormMessages.formTitle,
  title: 'Tilfærsla réttinda',
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      // title: otherParentApprovalFormMessages.reviewSection,
      title: 'Samþykki',
      children: [
        buildMultiField({
          id: 'multi',
          // title: title: otherParentApprovalFormMessages.multiTitle,
          title: 'Samþykki á tilfærslu réttinda',
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              // description: otherParentApprovalFormMessages.introDescription,
              description:
                'Í umsókn um fæðingarorlof hefur hitt foreldrið óskað eftir tilfærslu á réttindum frá þér til sín. Óskað er eftir tilfærslu á eftirfærandi réttindum:',
            }),
            buildTextField({
              id: 'requestingRights',
              title: 'Fjöldi daga sem óskað er eftir',
              description:
                'Að nýta daga af þínum rétti til töku fæðingarorlofs, við það minnkar hámarksréttur þinn',
              condition: (answers) =>
                getApplicationAnswers(answers).isRequestingRights === YES,
              // TODO: update when requested days are no longer a binary choice
              // defaultValue: (application: Application) => getApplicationAnswers(application.answers).requestDays
              defaultValue: 45,
              disabled: true,
            }),
            buildTextField({
              id: 'requestingPersonalDiscount',
              title: 'Hlutfall sem óskað er eftir',
              description:
                'Að nýta persónuafslátt þinn á meðan á fæðingarorlofi stendur',
              condition: (answers) =>
                getApplicationAnswers(answers)
                  .usePersonalAllowanceFromSpouse === YES,
              defaultValue: (application: Application) => {
                const {
                  spouseUseAsMuchAsPossible,
                  spouseUsage,
                } = getApplicationAnswers(application.answers)

                if (spouseUseAsMuchAsPossible) {
                  return '100%'
                }

                return `${spouseUsage}%`
              },
              disabled: true,
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
