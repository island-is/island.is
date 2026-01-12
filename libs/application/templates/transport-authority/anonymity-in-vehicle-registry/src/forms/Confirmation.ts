import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, confirmation } from '../lib/messages'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  logo: TransportAuthorityLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      alertMessage: confirmation.general.alertMessage,
      expandableHeader: confirmation.general.accordionTitle,
      expandableDescription: confirmation.general.accordionText,
    }),
  ],
})
