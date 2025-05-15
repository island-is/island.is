import { Form, FormModes } from '@island.is/application/types'
import { buildDescriptionField, buildForm } from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const Declined: Form = buildForm({
  id: 'Declined',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'noInsurance',
      title: e.no.sectionLabel,
      description: e.no.sectionDescription,
    }),
  ],
})

export default Declined
