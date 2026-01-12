import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { application, submitted } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const LoginServiceFormSubmitted: Form = buildForm({
  id: 'LoginServiceFormSubmitted',
  title: application.name,
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      alertTitle: submitted.general.pageTitle,
      expandableHeader: submitted.general.expandableTitle,
      expandableDescription: submitted.labels.desceriptionBulletPoints,
    }),
  ],
})
