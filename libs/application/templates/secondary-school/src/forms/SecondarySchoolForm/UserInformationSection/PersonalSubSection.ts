import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { ApplicationType } from '../../../shared'

export const personalSubSection = buildSubSection({
  id: 'personalSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: 'personalMultiField',
      title: userInformation.applicant.pageTitle,
      description: userInformation.applicant.description,
      children: [
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          readOnly: true,
        }).children,
        buildDescriptionField({
          id: 'otherAddressInfo.subtitle',
          title: userInformation.otherAddress.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'otherAddress.address',
          title: userInformation.otherAddress.address,
          backgroundColor: 'blue',
          width: 'half',
        }),
        buildTextField({
          id: 'otherAddress.postalCode',
          title: userInformation.otherAddress.postalCode,
          backgroundColor: 'blue',
          width: 'half',
        }),
        buildDescriptionField({
          id: 'applicationTypeInfo.subtitle',
          title: userInformation.applicationType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'applicationType.type',
          options: [
            {
              value: ApplicationType.FRESHMAN,
              label: userInformation.applicationType.freshmanOptionTitle,
            },
            {
              value: ApplicationType.GENERAL_APPLICATION,
              label:
                userInformation.applicationType.generalApplicationOptionTitle,
            },
          ],
          width: 'full',
        }),
      ],
    }),
  ],
})
