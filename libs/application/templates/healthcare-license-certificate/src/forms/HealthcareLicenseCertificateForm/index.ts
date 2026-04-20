import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { PersonalSection } from './personalSection'
import { SelectLicenseSection } from './selectLicenseSection'
import { DirectorateOfHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemsWithExtraLabel } from '../../utils'

export const HealthcareLicenseCertificateForm: Form = buildForm({
  id: 'HealthcareLicenseCertificateForm',
  logo: DirectorateOfHealthLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    PersonalSection,
    SelectLicenseSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: getChargeItemsWithExtraLabel,
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
