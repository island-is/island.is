import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Conclusion: Form = buildForm({
  id: 'ConclusionForm',
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
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: conclusion.general.alertTitle,
      alertMessage: conclusion.general.alertMessage,
      expandableHeader: conclusion.general.accordionTitle,
      expandableDescription: conclusion.general.accordionText,
    }),
  ],
})
