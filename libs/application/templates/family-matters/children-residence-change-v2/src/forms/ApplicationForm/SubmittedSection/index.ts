import { buildCustomField, buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const submittedSection = buildSection({
  id: 'submitted',
  title: m.section.received,
  children: [
    buildCustomField({
      id: 'residenceChangeConfirmation',
      title: m.confirmation.general.pageTitle,
      component: 'Confirmation',
    }),
  ],
})
