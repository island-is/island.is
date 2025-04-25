import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  employmentSearch as employmentSearchMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const introductoryMeetingAgreementSubSection = buildSubSection({
  id: 'introductoryMeetingAgreementSubSection',
  title: employmentSearchMessages.introductoryMeetingAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'introductoryMeetingAgreementSubSection',
      title: employmentSearchMessages.introductoryMeetingAgreement.pageTitle,
      description:
        employmentSearchMessages.introductoryMeetingAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'introductoryMeetingAgreement.description',
          title:
            employmentSearchMessages.introductoryMeetingAgreement
              .languageQuestion,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'introductoryMeeting.language',
          title:
            employmentSearchMessages.introductoryMeetingAgreement.languageLabel,
          options: (application) => {
            const languages = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'languages',
            ) ?? [
              {
                name: 'Íslenska',
              },
              {
                name: 'Enska',
              },
              {
                name: 'Danska',
              },
            ]
            return languages.map((language) => ({
              value: language.name,
              label: language.name,
            }))
          },
          placeholder:
            employmentSearchMessages.introductoryMeetingAgreement
              .languagePlaceholder,
        }),
      ],
    }),
  ],
})
