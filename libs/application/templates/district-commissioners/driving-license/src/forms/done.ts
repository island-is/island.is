import { buildForm, getValueViaPath, YES } from '@island.is/application/core'
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
          ? getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
            ? m.applicationDoneAlertMessage65RenewalRedesigned
            : m.applicationDoneAlertMessage65Renewal
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableIntro: ({ answers }) =>
        answers.applicationFor === B_FULL_RENEWAL_65 &&
        getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
          ? m.nextStepsIntro65RenewalRedesigned
          : m.nextStepsIntroDefault,
      expandableDescription: ({ answers, externalData }) =>
        answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
            ? m.nextStepsDescription65RenewalRedesigned
            : m.nextStepsDescription65Renewal
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : m.nextStepsInfoLink,
    }),
  ],
})
