import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  conclusion,
  review,
} from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.REJECTED,
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
    buildSection({
      id: 'review',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.rejectedTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.rejected.alertMessage,
      alertMessage: conclusion.rejected.thirdText,
      expandableHeader: conclusion.rejected.firstText,
      expandableDescription: conclusion.rejected.secondText,
    }),
  ],
})
