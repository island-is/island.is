import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { PREPAID_INHERITANCE } from '../lib/constants'

export const done: Form = buildForm({
  id: 'inheritanceReportDone',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: 'Umsókn móttekin',
      alertTitle: 'Umsókn móttekin',
      alertMessage: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.doneTitlePrepaidEFS
          : m.doneTitleEFS,
      expandableHeader: m.nextSteps,
      expandableDescription: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.doneDescriptionPrepaidEFS
          : m.doneDescriptionEFS,
    }),
  ],
})
