import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { overviewFields } from '../../utils/overviewFields'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      description:
        socialInsuranceAdministrationMessage.confirm.overviewDescription,
      children: [
        ...overviewFields(true),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: socialInsuranceAdministrationMessage.confirm.submitButton,
          actions: [
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
