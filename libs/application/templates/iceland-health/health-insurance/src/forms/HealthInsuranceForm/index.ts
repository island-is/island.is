import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { applicantInformationSection } from './aplicantInformationSection'
import { statusAndChildrenSection } from './statusAndChildrenSection'
import { formerInsuranceSection } from './formerInsuranceSection'
import { overviewSection } from './overviewSection'
import { extraInformationSection } from './extraInformationSection'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    applicantInformationSection,
    statusAndChildrenSection,
    formerInsuranceSection,
    extraInformationSection,
    overviewSection,
  ],
})
