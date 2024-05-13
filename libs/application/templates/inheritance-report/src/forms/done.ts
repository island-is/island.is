import {
  buildCustomField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { INHERITANCE, PREPAID_INHERITANCE } from '../lib/constants'
import { Application } from '@island.is/api/schema'

export const done: Form = buildForm({
  id: 'inheritanceReportDone',
  title: '',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    /*buildMultiField({
      id: 'done',
      title: m.doneTitle,
      description: m.doneDescription,
      children: [
        buildCustomField({
          id: 'doneImage',
          component: 'DoneImage',
          title: '',
        }),
      ],
    }),*/
    buildFormConclusionSection({
      sectionTitle: 'test',
      multiFieldTitle: 'test',
      alertTitle: 'test',
      alertMessage: 'test',
      expandableHeader: 'test',
      expandableDescription: 'test',
    }),
  ],
})
