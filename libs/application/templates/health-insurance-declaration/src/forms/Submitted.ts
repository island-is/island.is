import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { application } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const HealthInsuranceDeclarationSubmitted: Form = buildForm({
  id: 'HealthInsuranceDeclarationSubmitted',
  title: application.general.name,
  mode: FormModes.APPROVED,
  children: [buildFormConclusionSection({})],
})
