import { buildForm } from '@island.is/application/core'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { FormModes } from '@island.is/application/types'
import { extraDataChangedCircumstancesUploadSection } from './changedCircumstancesUploadSection'
import { extraDataCustodyAgreementUploadSection } from './custodyAgreementUploadSection'
import { extraDataExemptionReasonUploadSection } from './exemptionReasonUploadSection'
import { extraDataMessageSection } from './messageSection'
import { extraDataOverviewSection } from './overviewSection'

export const ExtraDataForm = buildForm({
  id: 'ExtraDataForm',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [
    extraDataMessageSection,
    extraDataExemptionReasonUploadSection,
    extraDataCustodyAgreementUploadSection,
    extraDataChangedCircumstancesUploadSection,
    extraDataOverviewSection,
  ],
})
