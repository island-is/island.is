import { YES, buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { needsHealthCertificateCondition } from '../lib/utils/formUtils'
import { License } from '../lib/constants'

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
        answers.applicationFor === License.B_TEMP
          ? m.applicationDoneAlertMessage
          : answers.applicationFor === License.BE
          ? m.applicationDoneAlertMessageBE
          : answers.applicationFor === License.B_FULL_RENEWAL_65
          ? m.applicationDoneAlertMessage65Renewal
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableDescription: ({ answers, externalData }) =>
        answers.applicationFor === License.B_TEMP
          ? m.nextStepsDescription
          : answers.applicationFor === License.BE
          ? m.nextStepsDescriptionBE
          : answers.applicationFor === License.B_FULL_RENEWAL_65
          ? m.nextStepsDescription65Renewal
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : m.nextStepsInfoLink,
    }),
  ],
})
