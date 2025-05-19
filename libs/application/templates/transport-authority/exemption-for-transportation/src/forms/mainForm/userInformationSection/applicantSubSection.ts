import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const applicantSubSection = buildSubSection({
  id: 'applicantSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: userInformation.general.pageTitle,
      children: [
        // Applicant
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          baseInfoReadOnly: true,
          compactFields: true,
          emailRequired: true,
          phoneRequired: true,
          customAddressLabel: userInformation.transporter.address,
          customPostalCodeAndCityLabel:
            userInformation.transporter.postalCodeAndCity,
        }).children,
      ],
    }),
  ],
})
