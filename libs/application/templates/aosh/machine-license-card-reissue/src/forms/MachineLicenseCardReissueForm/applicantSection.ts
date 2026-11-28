import {
  buildSection,
  buildAlertMessageField,
  buildMultiField,
} from '@island.is/application/core'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import { applicant } from '../../lib/messages'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicantInformation',
      title: applicant.general.pageTitle,
      children: [
        ...applicantInformationArray({
          phoneRequired: true,
          addressRequired: false,
          postalCodeRequired: false,
          cityRequired: false,
          baseInfoReadOnly: true,
          customAddressLabel: applicant.label.address,
        }),
        buildAlertMessageField({
          id: 'applicationInfoEmailPhoneAlertMessage',
          title: '',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicant.label.alertMessage,
        }),
      ],
    }),
  ],
})
