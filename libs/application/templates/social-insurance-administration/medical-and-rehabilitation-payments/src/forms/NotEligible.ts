import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Application, Form, FormModes } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'
import { eligibleText } from '../utils/medicalAndRehabilitationPaymentsUtils'

export const NotEligible: Form = buildForm({
  id: 'medicalAndrehabilitationPaymentsNotEligible',
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'notEligible',
      tabTitle: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [
        buildDescriptionField({
          id: 'notEligible.description',
          title: medicalAndRehabilitationPaymentsFormMessage.notEligible.title,
          description: (application: Application) =>
            eligibleText(application.externalData),
        }),
      ],
    }),
  ],
})
