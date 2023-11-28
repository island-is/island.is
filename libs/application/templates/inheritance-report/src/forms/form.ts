import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { assets } from './sections/assets'
import { debts } from './sections/debts'
import { business } from './sections/business'
import { heirs } from './sections/heirs'
import { funeralCost } from './sections/funeralCost'
import { applicant } from './sections/applicant'
import { dataCollection } from './sections/dataCollection'
import { deceased } from './sections/deceased'

export const form: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    deceased,
    dataCollection,
    applicant,
    assets,
    debts,
    funeralCost,
    business,
    heirs,
    buildSection({
      id: 'finalStep',
      title: m.readyToSubmit,
      children: [
        buildMultiField({
          id: 'finalStep',
          title: m.readyToSubmit,
          description: '',
          children: [
            buildCustomField({
              id: 'inheritanceReport.finalStepAcknowledgement',
              title: '',
              component: 'FinalStep',
            }),
            buildSubmitField({
              id: 'inheritanceReport.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitReport,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
