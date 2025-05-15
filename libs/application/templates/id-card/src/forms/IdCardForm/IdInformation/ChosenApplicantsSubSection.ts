import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  buildCustomField,
} from '@island.is/application/core'
import { IdentityDocument, Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import {
  getCombinedApplicantInformation,
  isAvailableForApplication,
} from '../../../utils'
import { formatDate } from '../../../utils/formatDate'
import { Option } from '@island.is/application/types'

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
          largeButtons: true,
          required: true,
          options: (application) => {
            const applicantInformation = getCombinedApplicantInformation(
              application.externalData,
            )

            const applicantIIDisabled = !isAvailableForApplication(
              'II',
              applicantInformation,
            )

            const applicantIDDisabled = !isAvailableForApplication(
              'ID',
              applicantInformation,
            )

            const passportList: Array<Option> = [
              {
                label: applicantInformation.name ?? '',
                subLabel: applicantInformation.passport
                  ? {
                      ...idInformation.labels.idNumber,
                      values: {
                        passportNumber: applicantInformation.passport?.number,
                        expirationDate:
                          applicantInformation.passport.expirationDate &&
                          formatDate(
                            new Date(
                              applicantInformation.passport.expirationDate,
                            ),
                          ),
                      },
                    }
                  : {
                      ...idInformation.labels.noIdNumber,
                    },
                value: applicantInformation.nationalId ?? '',
                disabled:
                  (applicantIIDisabled && applicantIDDisabled) ||
                  applicantInformation.citizenship?.code !== 'IS',
              },
            ]

            applicantInformation.children?.map((item) => {
              const isDisabledDueToCitizenship = item.citizenship?.kodi !== 'IS'
              const idDocument =
                item.passports && item.passports.length > 0
                  ? (item.passports[0] as IdentityDocument)
                  : undefined

              const IIDisabled = !isAvailableForApplication('II', {
                passport: idDocument,
              })

              const IDDisabled = !isAvailableForApplication('ID', {
                passport: idDocument,
              })
              return passportList.push({
                label: item.childName ?? '',
                subLabel: idDocument
                  ? {
                      ...idInformation.labels.idNumber,
                      values: {
                        passportNumber: idDocument.number,
                        expirationDate:
                          idDocument.expirationDate &&
                          formatDate(new Date(idDocument.expirationDate)),
                      },
                    }
                  : {
                      ...idInformation.labels.noIdNumber,
                    },

                value: item.childNationalId ?? '',
                disabled:
                  (IIDisabled && IDDisabled) || isDisabledDueToCitizenship,
              })
            })

            return passportList
          },
        }),
        buildCustomField({
          id: 'clearAnswers',
          component: 'ClearAnswers',
          description: '',
        }),
      ],
    }),
  ],
})
