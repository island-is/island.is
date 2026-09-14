import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'

interface DrivingLicenseFormConfig {
  allowFakeData?: boolean
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
      ...(allowFakeData ? [sectionFakeData] : []),
      sectionExternalData,
    ],
  })
