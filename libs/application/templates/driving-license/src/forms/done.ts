import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { B_TEMP, BE, YES } from '../lib/constants'
import { needsHealthCertificateCondition } from '../lib/utils'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationDone,
      alertMessage: ({ answers }) =>
        answers.applicationFor === B_TEMP
          ? m.applicationDoneAlertMessage
          : answers.applicationFor === BE
          ? m.applicationDoneAlertMessageBE
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableDescription: ({ answers, externalData }) =>
        answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : '',
    }),
  ],
})
