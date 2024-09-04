import {
  buildForm,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewConfirmation } from '../lib/messages'
import { getChosenApplicant } from '../utils'
import { IdentityDocumentChild } from '@island.is/clients/passports'

export const Approved: Form = buildForm({
  id: 'Approved',
  title: '',
  // logo: Logo,
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
          application.answers,
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
      title: '',
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
          formValue,
          externalData,
          applicantNationalId,
        )
        const applicantChildren = getValueViaPath(
          externalData,
          'identityDocument.data.childPassports',
          [],
        ) as Array<IdentityDocumentChild>

        const chosenChild = applicantChildren.filter(
          (x) => x.childNationalId === applicantNationalId,
        )?.[0]

        return (
          !chosenApplicant.isApplicant &&
          chosenChild &&
          !!chosenChild.secondParent
        )
      },
    }),
    buildAlertMessageField({
      id: 'uiForms.conclusionAlertInfo2',
      title: '',
      alertType: 'info',
      message: reviewConfirmation.general.infoMessageText2,
      condition: (formValue, externalData) => {
        const applicantNationalId = getValueViaPath(
          formValue,
          'chosenApplicants',
          '',
        ) as string
        const chosenApplicant = getChosenApplicant(
          formValue,
          externalData,
          applicantNationalId,
        )
        const applicantChildren = getValueViaPath(
          externalData,
          'identityDocument.data.childPassports',
          [],
        ) as Array<IdentityDocumentChild>

        const chosenChild = applicantChildren.filter(
          (x) => x.childNationalId === applicantNationalId,
        )?.[0]

        return (
          !chosenApplicant.isApplicant &&
          chosenChild &&
          !!chosenChild.secondParent
        )
      },
    }),
  ],
})
