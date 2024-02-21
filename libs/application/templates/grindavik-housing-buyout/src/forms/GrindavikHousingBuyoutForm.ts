import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import * as m from '../lib/messages'

export const GrindavikHousingBuyoutForm: Form = buildForm({
  id: 'GrindavikHousingBuyoutDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.infoSectionTitle,
      children: [applicantInformationMultiField()],
    }),
  ],
})
