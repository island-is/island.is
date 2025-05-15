import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { institutionApplicationMessages as m } from '../lib/messages'

export const approved: Form = buildForm({
  id: 'InstitutionCollaborationApprovedForm',
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      alertTitle: m.confirmation.sectionTitle,
      expandableHeader: m.confirmation.sectionInfoHeader,
      expandableDescription: m.confirmation.sectionInfoBulletPoints,
    }),
  ],
})
