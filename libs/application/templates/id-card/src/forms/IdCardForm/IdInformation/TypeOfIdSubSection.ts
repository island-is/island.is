import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  IdentityDocument,
  IdentityDocumentChild,
  Routes,
} from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import { getChosenApplicant, isAvailableForApplication } from '../../../utils'
import { NationalRegistryIndividual } from '@island.is/application/types'

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
            const applicantNationalRegistry = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              {},
            ) as NationalRegistryIndividual
            const chosenApplicant = getChosenApplicant(application)
            let applicantPassport: IdentityDocument | undefined
            if (
              chosenApplicant.nationalId ===
              applicantNationalRegistry.nationalId
            ) {
              applicantPassport = getValueViaPath(
                application.externalData,
                'identityDocument.data.userPassport',
                undefined,
              ) as IdentityDocument | undefined
            } else {
              const childPassports = getValueViaPath(
                application.externalData,
                'identityDocument.data.childPassports',
                undefined,
              ) as Array<IdentityDocumentChild> | undefined

              applicantPassport =
                childPassports &&
                childPassports.find(
                  (x) => x.childNationalId === chosenApplicant.nationalId,
                )?.passports?.[0]
            }
            const IIDisabled = applicantPassport
              ? !isAvailableForApplication(
                  applicantPassport.expirationDate,
                  'II',
                  `${applicantPassport.type}${applicantPassport.subType}`,
                  applicantNationalRegistry.age,
                )
              : false

            const IDDisabled = applicantPassport
              ? !isAvailableForApplication(
                  applicantPassport.expirationDate,
                  'ID',
                  `${applicantPassport.type}${applicantPassport.subType}`,
                  applicantNationalRegistry.age,
                )
              : false
            return [
              //II = Nafnskírteini ekki sem ferðaskilríki, ID = Nafnskírteini sem ferðaskilríki
              {
                label: idInformation.labels.typeOfIdRadioAnswerOne,
                value: 'II',
                disabled: IIDisabled,
              },
              {
                label: idInformation.labels.typeOfIdRadioAnswerTwo,
                value: 'ID',
                disabled: IDDisabled,
              },
            ]
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
