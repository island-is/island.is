import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, conclusion } from '../lib/messages'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const ReviewSellerForm: Form = buildForm({
  id: 'ReviewSellerForm',
  logo: AoshLogo,
  mode: FormModes.IN_PROGRESS,
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
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      alertMessage: conclusion.default.alertMessage,
      expandableHeader: conclusion.default.accordionTitle,
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
