import { buildForm, YES } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { B_FULL_RENEWAL_65, B_TEMP } from '../utils/constants'
import { needsHealthCertificateCondition } from '../utils'

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
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? m.applicationDoneAlertMessage65RenewalRedesigned
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableIntro: ({ answers }) =>
        answers.applicationFor === B_FULL_RENEWAL_65
          ? m.nextStepsIntro65RenewalRedesigned
          : m.nextStepsIntroDefault,
      expandableDescription: ({ answers, externalData }) =>
        answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? m.nextStepsDescription65RenewalRedesigned
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : m.nextStepsInfoLink,
    }),
  ],
})
