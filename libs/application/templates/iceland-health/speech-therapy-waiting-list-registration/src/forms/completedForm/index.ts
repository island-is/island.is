import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildForm, YES } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusionMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: IcelandHealthLogo,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: conclusionMessages.multiFieldTitle,
      alertTitle: (application) =>
        getApplicationAnswers(application.answers).waitingListConsent === YES
          ? conclusionMessages.consentAlertTitle
          : conclusionMessages.declineAlertTitle,
      alertMessage: undefined,
      accordion: false,
      descriptionFieldDescription: (application) =>
        getApplicationAnswers(application.answers).waitingListConsent === YES
          ? conclusionMessages.consentDescription
          : conclusionMessages.declineDescription,
    }),
  ],
})
