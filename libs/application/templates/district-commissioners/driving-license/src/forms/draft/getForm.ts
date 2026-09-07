import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'
import { subSectionApplicationFor } from './subSectionApplicationFor'
import { subSectionRequirements } from './subSectionRequirements'
import { subSectionApplicantInfo } from './subSectionApplicantInfo'
import { subSectionOtherCountry } from './subSectionOtherCountry'
import { subSectionOtherCountryDirections } from './subSectionOtherCountryDirections'
import { subSectionQualityPhoto } from './subSectionQualityPhoto'
import { subSectionQualityPhoto65 } from './subSectionQualityPhoto65'
import { subSectionQualityPhotoTemp } from './subSectionQualityPhotoTemp'
import { subSectionQualityPhotoBFull } from './subSectionQualityPhotoBFull'
import { subSectionDelivery } from './subSectionDelivery'
import { subSectionHealthDeclaration } from './subSectionHealthDeclaration'
import { subSectionSummary } from './subSectionSummary'

interface DrivingLicenseFormConfig {
  allowPickLicense?: boolean
  allow65Renewal?: boolean
  allow65RenewalRedesign?: boolean
  allowBTempRedesign?: boolean
  allowBFullRedesign?: boolean
}

export const getForm = ({
  allowPickLicense = false,
  allow65Renewal = false,
  allow65RenewalRedesign = false,
  allowBTempRedesign = false,
  allowBFullRedesign = false,
}: DrivingLicenseFormConfig): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationDraftForm',
    logo: DistrictCommissionersLogo,
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSection,
        children: [
          ...(allowPickLicense ? [subSectionApplicationFor(allow65Renewal)] : []),
          subSectionRequirements(
            allow65RenewalRedesign,
            allowBTempRedesign,
            allowBFullRedesign,
          ),
        ],
      }),
      buildSection({
        id: 'info',
        title: m.informationTitle,
        children: [
          subSectionApplicantInfo,
          subSectionOtherCountry,
          subSectionOtherCountryDirections,
          subSectionQualityPhoto,
          subSectionQualityPhoto65,
          subSectionQualityPhotoTemp,
          subSectionQualityPhotoBFull,
          subSectionDelivery,
          subSectionHealthDeclaration,
          subSectionSummary,
        ],
      }),
      buildSection({
        id: 'payment',
        title: m.overviewPaymentCharge,
        children: [],
      }),
      buildSection({
        id: 'confirm',
        title: m.overviewSectionTitle,
        children: [],
      }),
      buildSection({
        id: 'done',
        title: m.applicationDone,
        children: [],
      }),
    ],
  })
