import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import {
  IdentityDocument,
  IdentityDocumentChild,
  Routes,
} from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import { isAvailableForApplication } from '../../../utils'
import { formatDate } from '../../../utils/formatDate'

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
          id: Routes.CHOSENAPPLICANTS,
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
              'identityDocument.data.userPassport',
              undefined,
            ) as IdentityDocument | undefined

            const applicantChildren = getValueViaPath(
              application.externalData,
              'identityDocument.data.childPassports',
              [],
            ) as Array<IdentityDocumentChild>

            const applicantIIDisabled = applicantPassport
              ? !isAvailableForApplication(
                  applicantPassport.expirationDate,
                  'II',
                  `${applicantPassport.type}${applicantPassport.subType}`,
                )
              : false

            const applicantIDDisabled = applicantPassport
              ? !isAvailableForApplication(
                  applicantPassport.expirationDate,
                  'ID',
                  `${applicantPassport.type}${applicantPassport.subType}`,
                )
              : false

            const passportList: Array<any> = [
              {
                label: applicantName,
                subLabel: applicantPassport
                  ? {
                      ...idInformation.labels.idNumber,
                      values: {
                        passportNumber: applicantPassport?.number,
                        expirationDate: formatDate(
                          new Date(applicantPassport.expirationDate),
                        ),
                      },
                    }
                  : {
                      ...idInformation.labels.noIdNumber,
                    },
                value: applicantNationalId,
                disabled: applicantIIDisabled && applicantIDDisabled,
              },
            ]

            applicantChildren.map((item) => {
              const idDocument =
                item.passports && item.passports.length > 0
                  ? (item.passports[0] as IdentityDocument)
                  : undefined
              const IIDisabled = idDocument
                ? !isAvailableForApplication(
                    idDocument.expirationDate,
                    'II',
                    `${idDocument.type}${idDocument.subType}`,
                  )
                : false

              const IDDisabled = idDocument
                ? !isAvailableForApplication(
                    idDocument.expirationDate,
                    'ID',
                    `${idDocument.type}${idDocument.subType}`,
                  )
                : false
              return passportList.push({
                label: item.childName,
                subLabel: idDocument
                  ? {
                      ...idInformation.labels.idNumber,
                      values: {
                        passportNumber: idDocument.number,
                        expirationDate: formatDate(
                          new Date(idDocument.expirationDate),
                        ),
                      },
                    }
                  : {
                      ...idInformation.labels.noIdNumber,
                    },

                value: item.childNationalId,
                disabled: IIDisabled && IDDisabled,
              })
            })

            return passportList
          },
        }),
        buildCustomField({
          id: 'clearAnswers',
          component: 'ClearAnswers',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
