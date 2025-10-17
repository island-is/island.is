import { buildForm, buildSection } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: DistrictCommissionersLogo,
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildFormConclusionSection({
      sectionTitle: m.confirmation,
      alertMessage: m.successTitle,
      expandableIntro: '',
      expandableDescription: m.conclusionExpandableDescription,
    }),
  ],
})
