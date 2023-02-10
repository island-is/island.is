import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, confirmation } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { formConclusionSection } from '@island.is/application/ui-forms'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  title: '',
  logo: Logo,
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
    formConclusionSection({
      alertTitle: confirmation.general.title,
      alertMessage: confirmation.general.alertMessageTitle,
      expandableHeader: confirmation.general.accordionTitle,
      expandableDescription: confirmation.general.accordionText,
    }),
  ],
})
