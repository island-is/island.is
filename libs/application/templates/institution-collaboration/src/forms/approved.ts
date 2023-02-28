import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { formConclusionSection } from '@island.is/application/ui-forms'
import { institutionApplicationMessages as m } from '../lib/messages'

export const approved: Form = buildForm({
  id: 'InstitutionCollaborationApprovedForm',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    formConclusionSection({
      alertTitle: m.confirmation.sectionTitle,
      expandableHeader: m.confirmation.sectionInfoHeader,
      expandableDescription: m.confirmation.sectionInfoBulletPoints,
    }),
  ],
})
