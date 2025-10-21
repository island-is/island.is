import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { applicantInfoSection } from './applicantInfoSection'
import { noHealthInsuranceSection } from './noHealthInsuranceSection'
import { studentOrTouristSection } from './studentOrTouristSection'
import { registerPersonsSection } from './registerPersonsSection'
import { touristResidencySection } from './touristResidencySection'
import { studentResidencySection } from './studentResidencySection'
import { educationalConfirmationSection } from './educationalConfirmationSection'
import { dateSection } from './dateSection'
import { overviewSection } from './overviewSection'
import * as m from '../../lib/messages'

export const HealthInsuranceDeclarationForm: Form = buildForm({
  id: 'HealthInsuranceDeclarationDraft',
  title: m.application.general.name,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
  children: [
    applicantInfoSection,
    noHealthInsuranceSection,
    studentOrTouristSection,
    registerPersonsSection,
    touristResidencySection,
    studentResidencySection,
    educationalConfirmationSection,
    dateSection,
    overviewSection,
  ],
})
