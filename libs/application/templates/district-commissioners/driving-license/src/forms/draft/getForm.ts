import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionRequirements } from './sectionRequirements'
import { sectionApplicantInfo } from './sectionApplicantInfo'
import { sectionOtherCountry } from './sectionOtherCountry'
import { sectionPhoto } from './sectionPhoto'
import { sectionDelivery } from './sectionDelivery'
import { sectionHealthDeclaration } from './sectionHealthDeclaration'
import { sectionSummary } from './sectionSummary'

interface DrivingLicenseFormConfig {
  allowPickLicense?: boolean
  allow65Renewal?: boolean
}

export const getForm = ({
  allowPickLicense = false,
  allow65Renewal = false,
}: DrivingLicenseFormConfig): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationDraftForm',
    logo: DistrictCommissionersLogo,
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowPickLicense ? [sectionApplicationFor(allow65Renewal)] : []),
      // When selection is hidden no radio sets `applicationFor`; sectionRequirements
      // freezes it to the applicant's single structural candidate instead.
      sectionRequirements(!allowPickLicense),
      sectionApplicantInfo,
      sectionOtherCountry,
      sectionPhoto,
      sectionDelivery,
      sectionHealthDeclaration,
      sectionSummary,
    ],
  })
