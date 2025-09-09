import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { disabilityPensionFormMessage } from '../../lib/messages'

export const NotEligible: Form = buildForm({
  id: 'disabilityPensionNotEligible',
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'notEligible',
      tabTitle: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [
        buildDescriptionField({
          id: 'notEligible.description',
          title: disabilityPensionFormMessage.notEligible.title,
          description: () => 'TODO',
        }),
      ],
    }),
  ],
})
