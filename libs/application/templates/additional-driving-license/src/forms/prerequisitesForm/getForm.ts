import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'
import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionRequirements } from './sectionRequirements'
import { sectionAdvancedLicenseSelection } from './sectionAdvancedLicenseSelection'

interface DrivingLicenseFormConfig {
  allowFakeData?: boolean
  allowPickLicense?: boolean
  allowBELicense?: boolean
  allowAdvanced?: boolean
}

export const getForm = ({
  allowFakeData = false,
}: DrivingLicenseFormConfig): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationPrerequisitesForm',
    logo: DistrictCommissionersLogo,
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSection,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          sectionExternalData,
          sectionApplicationFor,
          sectionAdvancedLicenseSelection,
          sectionRequirements,
        ],
      }),
      buildSection({
        id: 'info',
        title: m.informationTitle,
        children: [],
      }),
      buildSection({
        id: 'payment',
        title: m.overviewPaymentCharge,
        children: [],
      }),
      buildSection({
        id: 'confirm',
        title: m.applicationDone,
        children: [],
      }),
    ],
  })
