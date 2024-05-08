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
import { GetFormattedText } from '../../../utils'

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

            // const subLabel = GetFormattedText(
            //   application,
            //   idInformation.labels.idNumber,
            // )

            const applicantChildren = getValueViaPath(
              application.externalData,
              'identityDocument.data.childPassports',
              [],
            ) as Array<IdentityDocumentChild>

            const passportList = [
              {
                label: applicantName,
                // subLabel: `${subLabel}: ${applicantPassport.number}`,
                value: applicantNationalId,
              },
            ]
            applicantChildren.map((item) =>
              passportList.push({
                label: item.childName,
                // subLabel:
                //   item.passports && item.passports.length > 0
                //     ? `${subLabel}: ${item.passports[0].number}`
                //     : '',
                value: item.childNationalId,
              }),
            )

            return passportList
          },
        }),
      ],
    }),
  ],
})
