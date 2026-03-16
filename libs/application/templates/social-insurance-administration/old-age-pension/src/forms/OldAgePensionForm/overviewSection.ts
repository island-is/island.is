import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { getApplicationAnswers } from '../../utils/oldAgePensionUtils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
  children: [
    buildMultiField({
      id: 'confirm',
      children: [
        buildCustomField(
          {
            id: 'confirmScreen',
            component: 'Review',
          },
          {
            editable: true,
          },
        ),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: socialInsuranceAdministrationMessage.confirm.submitButton,
          actions: [
            {
              event: DefaultEvents.ABORT,
              name: socialInsuranceAdministrationMessage.confirm.cancelButton,
              type: 'reject',
              condition: (answers) => {
                const { tempAnswers } = getApplicationAnswers(answers)
                return !!tempAnswers
              },
            },
            {
              event: DefaultEvents.SUBMIT,
              name: socialInsuranceAdministrationMessage.confirm.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
