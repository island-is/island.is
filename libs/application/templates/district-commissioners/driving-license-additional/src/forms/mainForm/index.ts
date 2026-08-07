import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { sectionApplicantInfo } from './sections/sectionApplicantInfo'
import { sectionQualityPhotoBE } from './sections/sectionQualityPhotoBE'
import { sectionDelivery } from './sections/sectionDelivery'
import { sectionHealthDeclaration } from './sections/sectionHealthDeclaration'
import { sectionSummary } from './sectionSummary'

export const mainForm: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  logo: DistrictCommissionersLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    sectionApplicantInfo,
    sectionQualityPhotoBE,
    sectionDelivery,
    sectionHealthDeclaration,
    sectionSummary,
  ],
})
