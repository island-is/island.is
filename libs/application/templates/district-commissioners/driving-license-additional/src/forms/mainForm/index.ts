import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'
import { sectionInfo } from './sectionInfo'
import { sectionSummary } from './sectionSummary'

export const mainForm: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  logo: DistrictCommissionersLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    sectionInfo,
    sectionSummary,
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
