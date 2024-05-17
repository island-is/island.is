import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  IdentityDocument,
  IdentityDocumentChild,
  Routes,
} from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const ChosenApplicantsSubSection = buildSubSection({
  id: Routes.CHOSENAPPLICANTS,
  title: idInformation.general.chosenApplicantsSectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.CHOSENAPPLICANTS}MultiField`,
      title: idInformation.general.chosenApplicantsSectionTitle,
      description: idInformation.labels.chosenApplicantsDescription,
      children: [
        buildRadioField({
          id: `${Routes.CHOSENAPPLICANTS}`,
          title: '',
          largeButtons: true,
          options: (application) => {
            const applicantName = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.fullName',
              '',
            ) as string

            const applicantNationalId = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.nationalId',
              '',
            ) as string

            const applicantPassport = getValueViaPath(
              application.externalData,
              'identityDocument.data.userPassport', // TODO CHANGE THIS TO ID NOT PASSPORT
              {},
            ) as IdentityDocument

            const applicantChildren = getValueViaPath(
              application.externalData,
              'identityDocument.data.childPassports',
              [],
            ) as Array<IdentityDocumentChild>

            // TODO fix this any and type this correctly
            const passportList: Array<any> = [
              {
                label: applicantName,
                subLabel: applicantPassport
                  ? {
                      ...idInformation.labels.idNumber,
                      values: { passportNumber: applicantPassport?.number },
                    }
                  : {
                      ...idInformation.labels.noIdNumber,
                    },
                value: applicantNationalId,
              },
            ]
            applicantChildren.map((item) => {
              console.log(item)
              return passportList.push({
                label: item.childName,
                subLabel:
                  item.passports && item.passports.length > 0
                    ? {
                        ...idInformation.labels.idNumber,
                        values: { passportNumber: item.passports[0].number },
                      }
                    : {
                        ...idInformation.labels.noIdNumber,
                      },

                value: item.childNationalId,
              })
            })

            return passportList
          },
        }),
      ],
    }),
  ],
})
