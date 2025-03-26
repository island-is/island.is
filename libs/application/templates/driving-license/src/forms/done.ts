import { buildForm, YES } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { B_FULL_RENEWAL_65, B_TEMP, BE } from '../lib/constants'
import { needsHealthCertificateCondition } from '../lib/utils'

export const done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationDone,
      alertMessage: ({ answers }) =>
        answers.applicationFor === B_TEMP
          ? m.applicationDoneAlertMessage
          : answers.applicationFor === BE
          ? m.applicationDoneAlertMessageBE
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? m.applicationDoneAlertMessage65Renewal
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableDescription: ({ answers, externalData }) =>
        answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : answers.applicationFor === BE
          ? m.nextStepsDescriptionBE
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? m.nextStepsDescription65Renewal
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : m.nextStepsInfoLink,
    }),
  ],
})
