import {
  buildForm,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewConfirmation } from '../lib/messages'
import { getChosenApplicant, hasSecondGuardian } from '../utils'

export const Approved: Form = buildForm({
  id: 'Approved',
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      sectionTitle: reviewConfirmation.general.sectionTitle,
      multiFieldTitle: reviewConfirmation.general.sectionTitle,
      alertTitle: reviewConfirmation.general.alertTitle,
      alertMessage: '',
      expandableHeader: reviewConfirmation.general.accordionTitle,
      expandableIntro: '',
      expandableDescription: (application) => {
        const applicantNationalId = getValueViaPath(
          application.answers,
          'chosenApplicants',
          '',
        ) as string
        const chosenApplicant = getChosenApplicant(
          application.externalData,
          applicantNationalId,
        )

        return !chosenApplicant.isApplicant
          ? reviewConfirmation.general.accordionTextForChild
          : reviewConfirmation.general.accordionText
      },
      bottomButtonMessage: reviewConfirmation.general.bottomButtonMessage,
    }),
    buildAlertMessageField({
      id: 'uiForms.conclusionAlertInfo1',
      alertType: 'info',
      message: reviewConfirmation.general.infoMessageText1,
      marginBottom: 0,
      condition: (formValue, externalData) => {
        const applicantNationalId = getValueViaPath(
          formValue,
          'chosenApplicants',
          '',
        ) as string
        const chosenApplicant = getChosenApplicant(
          externalData,
          applicantNationalId,
        )

        const applicantHasSecondGuardian = hasSecondGuardian(
          formValue,
          externalData,
        )

        return !chosenApplicant.isApplicant && applicantHasSecondGuardian
      },
    }),
    buildAlertMessageField({
      id: 'uiForms.conclusionAlertInfo2',
      alertType: 'info',
      message: reviewConfirmation.general.infoMessageText2,
      condition: (formValue, externalData) => {
        const applicantNationalId = getValueViaPath(
          formValue,
          'chosenApplicants',
          '',
        ) as string
        const chosenApplicant = getChosenApplicant(
          externalData,
          applicantNationalId,
        )

        const applicantHasSecondGuardian = hasSecondGuardian(
          formValue,
          externalData,
        )

        return !chosenApplicant.isApplicant && applicantHasSecondGuardian
      },
    }),
  ],
})
