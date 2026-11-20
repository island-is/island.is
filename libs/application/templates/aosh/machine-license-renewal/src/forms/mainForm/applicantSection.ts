import {
  buildAlertMessageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import { applicant } from '../../lib/messages'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicant',
      title: applicant.general.title,
      children: [
        ...applicantInformationArray({
          baseInfoReadOnly: true,
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
          addressRequired: false,
          postalCodeRequired: false,
          cityRequired: false,
        }),
        buildAlertMessageField({
          id: 'applicantAlertMessage',
          title: '',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicant.labels.alertMessage,
        }),
      ],
    }),
  ],
})
