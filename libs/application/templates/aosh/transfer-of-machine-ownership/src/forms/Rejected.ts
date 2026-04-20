import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  conclusion,
  review,
} from '../lib/messages'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { Machine } from '../shared'
import { getSelectedMachine } from '../utils'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  logo: AoshLogo,
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
      sectionTitle: conclusion.general.sectionTitle,
      alertTitle: conclusion.rejected.alertMessage,
      multiFieldTitle: conclusion.general.title,
      alertMessage: conclusion.rejected.thirdText,
      expandableHeader: (application) => {
        const machine = getSelectedMachine(
          application.externalData,
          application.answers,
        ) as Machine
        return {
          ...conclusion.rejected.firstText,
          values: { regNumber: machine.regNumber },
        }
      },
      expandableDescription: '',
      expandableIntro: conclusion.rejected.secondText,
      alertType: 'error',
    }),
  ],
})
