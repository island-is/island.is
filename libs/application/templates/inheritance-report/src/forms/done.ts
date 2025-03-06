import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages'
import { PREPAID_INHERITANCE } from '../lib/constants'

export const done: Form = buildForm({
  id: 'inheritanceReportDone',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: m.doneMultiFieldTitleEFS,
      alertTitle: m.doneAlertTitleEFS,
      alertMessage: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.doneTitlePrepaidEFS
          : m.doneTitleEFS,
      expandableHeader: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.expandableHeaderPrepaid
          : m.expandableHeaderEFS,
      expandableIntro: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.expandableIntroPrepaid
          : m.expandableIntroEFS,
      expandableDescription: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.doneDescriptionPrepaidEFS
          : m.doneDescriptionEFS,
      bottomButtonMessage: ({ answers }) =>
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.bottomButtonMessagePrepaidEFS
          : m.bottomButtonMessageEFS,
    }),
  ],
})
