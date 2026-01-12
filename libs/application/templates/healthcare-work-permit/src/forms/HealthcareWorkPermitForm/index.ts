import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { PersonalSection } from './personalSection'
import { SelectWorkPermitSection } from './selectWorkPermitSection'
import { DirectorateOfHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemsWithExtraLabel } from '../../utils'

export const HealthcareWorkPermitForm: Form = buildForm({
  id: 'HealthcareWorkPermitForm',
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
    SelectWorkPermitSection,
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
