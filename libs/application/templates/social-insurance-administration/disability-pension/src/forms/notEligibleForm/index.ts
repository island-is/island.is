import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Application, Form, FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { notEligibleText } from '../../utils/getNotEligibleText'

export const NotEligible: Form = buildForm({
  id: 'disabilityPensionNotEligible',
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'notEligible',
      tabTitle: sm.pre.externalDataSection,
      children: [
        buildDescriptionField({
          id: 'notEligible.description',
          title: m.notEligible.title,
          description: (application: Application) =>
            notEligibleText(application.externalData),
        }),
      ],
    }),
  ],
})
