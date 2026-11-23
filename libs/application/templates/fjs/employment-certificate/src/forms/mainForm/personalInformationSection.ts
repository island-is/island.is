import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import {
  applicantInformationMessages,
  applicantInformationMultiField,
} from '@island.is/application/ui-forms'
import { personalInformation as m, sections } from '../../lib/messages'

const fieldsToKeep = [
  'applicant.name',
  'applicant.nationalId',
  'applicant.email',
]

const applicantFields = applicantInformationMultiField({
  compactFields: true,
  baseInfoReadOnly: true,
  emailAndPhoneReadOnly: true,
  emailRequired: false,
})
  .children.filter((field) => fieldsToKeep.includes(field.id as string))
  .map((field) =>
    field.id === 'applicant.email'
      ? { ...field, width: 'full' as const }
      : field,
  )

export const personalInformationSection = buildSection({
  id: 'personalInformationSection',
  title: sections.personalInformation,
  children: [
    buildMultiField({
      id: 'personalInformation',
      title: m.title,
      children: [
        buildDescriptionField({
          id: 'applicantTitle',
          title: m.applicantTitle,
          titleVariant: 'h4',
        }),
        ...applicantFields,
        // The shared field's own box also mentions the phone number, which
        // isn't shown here, so the email-only text gets its own box.
        buildAlertMessageField({
          id: 'emailReadOnlyAlert',
          title: '',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicantInformationMessages.labels.alertMessageEmailOnly,
          links: [
            {
              title: applicantInformationMessages.labels.alertMessageLinkTitle,
              url: applicantInformationMessages.labels.alertMessageLink,
              isExternal: false,
            },
          ],
          marginTop: 3,
        }),
      ],
    }),
  ],
})
