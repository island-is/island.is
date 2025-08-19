import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const introductoryMeetingSubSection = buildSubSection({
  id: 'introductoryMeetingSubSection',
  title: employmentSearchMessages.introductoryMeeting.sectionTitle,
  children: [
    buildMultiField({
      id: 'introductoryMeetingSubSection',
      title: employmentSearchMessages.introductoryMeeting.pageTitle,
      description: employmentSearchMessages.introductoryMeeting.pageDescription,
      children: [
        buildDescriptionField({
          id: 'introductoryMeeting.description',
          title: employmentSearchMessages.introductoryMeeting.languageQuestion,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'introductoryMeeting.language',
          title: employmentSearchMessages.introductoryMeeting.languageLabel,
          required: true,
          options: (application) => {
            const languages =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.introductoryMeetingLanguages',
              ) || []
            return languages.map((language) => ({
              value: language.name,
              label: language.name,
            }))
          },
          placeholder:
            employmentSearchMessages.introductoryMeeting.languagePlaceholder,
        }),
      ],
    }),
  ],
})
