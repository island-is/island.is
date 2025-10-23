import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DirectorateOfFisheriesLogo } from '@island.is/application/assets/institution-logos'
import { shipSelectionSection } from './shipSelectionSection'
import { fishingLicenseSection } from './fishingLicenseSection'
import { fishingLicenseFurtherInfoSection } from './fishingLicenseFurtherInfoSection'
import { overviewSection } from './overviewSection'
import { conclusion, externalData, payment } from '../../lib/messages'
import { applicantInformationSection } from './applicantInformationSection'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const GeneralFishingLicenseForm: Form = buildForm({
  id: 'GeneralFishingLicenseForm',
  logo: DirectorateOfFisheriesLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'ExternalDataSection',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    applicantInformationSection,
    shipSelectionSection,
    fishingLicenseSection,
    fishingLicenseFurtherInfoSection,
    overviewSection,
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: conclusion.general.title,
      expandableHeader: conclusion.information.title,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
