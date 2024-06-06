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
import { isWithinExpirationDate } from '../../../utils'
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
              'identityDocument.data.userPassport',
              undefined,
            ) as IdentityDocument | undefined

            const applicantChildren = getValueViaPath(
              application.externalData,
              'identityDocument.data.childPassports',
              [],
            ) as Array<IdentityDocumentChild>

            const applicantIsDisabled = applicantPassport
              ? !isWithinExpirationDate(applicantPassport.expirationDate)
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
                disabled: applicantIsDisabled,
              },
            ]

            applicantChildren.map((item) => {
              const idDocument =
                item.passports && item.passports.length > 0
                  ? (item.passports[0] as IdentityDocument)
                  : undefined
              const isDisabled = idDocument
                ? isWithinExpirationDate(idDocument.expirationDate)
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
                disabled: isDisabled,
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
