import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { IdentityDocumentChild, Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import {
  getChosenApplicant,
  getCombinedApplicantInformation,
  isAvailableForApplication,
} from '../../../utils'

export const TypeOfIdSubSection = buildSubSection({
  id: Routes.TYPEOFID,
  title: idInformation.general.typeofIdSectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.TYPEOFID}multiField`,
      title: idInformation.labels.typeOfIdTitle,
      description: idInformation.labels.typeOfIdDescription,
      children: [
        buildRadioField({
          id: Routes.TYPEOFID,
          title: idInformation.labels.typeOfIdRadioLabel,
          width: 'half',
          required: true,
          options: (application) => {
            const combinedAppplicantInformation =
              getCombinedApplicantInformation(application.externalData)
            const radioAnswerApplicant = getValueViaPath(
              application.answers,
              'chosenApplicants',
            ) as string
            const chosenApplicant = getChosenApplicant(
              application.externalData,
              radioAnswerApplicant,
            )

            if (!chosenApplicant.isApplicant) {
              const childPassports = getValueViaPath(
                application.externalData,
                'identityDocument.data.childPassports',
                undefined,
              ) as Array<IdentityDocumentChild> | undefined

              combinedAppplicantInformation.passport = childPassports?.find(
                (x) => x.childNationalId === chosenApplicant.nationalId,
              )?.passports?.[0]
            }

            const IIDisabled = !isAvailableForApplication(
              'II',
              combinedAppplicantInformation,
            )

            const IDDisabled = !isAvailableForApplication(
              'ID',
              combinedAppplicantInformation,
            )
            return [
              //II = Nafnskírteini ekki sem ferðaskilríki, ID = Nafnskírteini sem ferðaskilríki
              {
                label: idInformation.labels.typeOfIdRadioAnswerTwo,
                value: 'ID',
                disabled: IDDisabled,
              },
              {
                label: idInformation.labels.typeOfIdRadioAnswerOne,
                value: 'II',
                disabled: IIDisabled,
              },
            ]
          },
        }),
        buildAlertMessageField({
          id: `${Routes.TYPEOFID}.alertField`,
          title: '',
          alertType: 'warning',
          message: idInformation.labels.warningText,
          condition: (answers, externalData) => {
            const combinedAppplicantInformation =
              getCombinedApplicantInformation(externalData)
            const radioAnswerApplicant = getValueViaPath(
              answers,
              'chosenApplicants',
            ) as string
            const chosenApplicant = getChosenApplicant(
              externalData,
              radioAnswerApplicant,
            )
            if (!chosenApplicant.isApplicant) {
              const childPassports = getValueViaPath(
                externalData,
                'identityDocument.data.childPassports',
                undefined,
              ) as Array<IdentityDocumentChild> | undefined

              combinedAppplicantInformation.passport = childPassports?.find(
                (x) => x.childNationalId === chosenApplicant.nationalId,
              )?.passports?.[0]
            }
            const IIDisabled = !isAvailableForApplication(
              'II',
              combinedAppplicantInformation,
            )

            const IDDisabled = !isAvailableForApplication(
              'ID',
              combinedAppplicantInformation,
            )
            return IIDisabled || IDDisabled
          },
        }),
        buildAlertMessageField({
          id: `${Routes.TYPEOFID}.alertField`,
          title: '',
          alertType: 'info',
          message: idInformation.labels.infoAlert,
        }),
      ],
    }),
  ],
})
