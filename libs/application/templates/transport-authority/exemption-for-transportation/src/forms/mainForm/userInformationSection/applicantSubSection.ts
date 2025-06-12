import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

const order = {
  applicantnationalId: 0,
  applicantname: 1,
  applicantaddress: 2,
  applicantpostalCodeAndCity: 3,
  applicantphoneNumber: 5,
  applicantemail: 6,
}

export const applicantSubSection = buildSubSection({
  id: 'applicantSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: userInformation.applicant.pageTitle,
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
        }).children.sort((a, b) => {
          const getOrder = (id: string): number => {
            return order[id as keyof typeof order] ?? 999
          }
          return getOrder(a.id) - getOrder(b.id)
        }),
      ],
    }),
  ],
})
