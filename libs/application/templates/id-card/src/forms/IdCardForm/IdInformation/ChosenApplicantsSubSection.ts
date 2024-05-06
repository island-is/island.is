import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  getValueViaPath,
  formatText,
  buildCheckboxField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import { useLocale } from '@island.is/localization'
import { GetFormattedText } from '../../../utils'
import { Application } from '@island.is/api/schema'
import { IdCardAnswers } from '../../..'
import { useFormContext } from 'react-hook-form'

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
          id: `${Routes.CHOSENAPPLICANTS}.applicant`,
          title: '',
          largeButtons: true,
          options: (application) => {
            const applicantName = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.fullName',
              '',
            ) as string

            const applicantIdNumber = getValueViaPath(
              application.externalData,
              'identityDocument.data.userPassport.number', // TODO CHANGE THIS TO ID NOT PASSPORT
              '',
            ) as string

            const subLabel = GetFormattedText(
              application,
              idInformation.labels.idNumber,
            )

            return [
              {
                label: applicantName,
                subLabel: `${subLabel}: ${applicantIdNumber}`,
                value: 'yes',
              },
            ]
          },
        }),
        buildRadioField({
          id: `${Routes.CHOSENAPPLICANTS}.children`,
          title: '',
          largeButtons: true,
          defaultValue: (application: Application) => {
            const isApplicantChosen = getValueViaPath(
              application.answers,
              `${Routes.CHOSENAPPLICANTS}.applicant[0]`,
              'empty',
            )

            console.log('isApplicantChosen', isApplicantChosen)
          },
          options: (application) => {
            const applicantName = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.fullName',
              '',
            ) as string

            const applicantIdNumber = getValueViaPath(
              application.externalData,
              'identityDocument.data.userPassport.number', // TODO CHANGE THIS TO ID NOT PASSPORT
              '',
            ) as string

            const subLabel = GetFormattedText(
              application,
              idInformation.labels.idNumber,
            )

            return [
              {
                label: applicantName,
                subLabel: `${subLabel}: ${applicantIdNumber}`,
                value: 'yes',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
