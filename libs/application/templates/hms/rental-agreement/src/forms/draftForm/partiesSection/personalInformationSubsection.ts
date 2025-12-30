import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'

interface ApplicantInformationInterface {
  externalData?: {
    nationalRegistry?: {
      data?: {
        fullName?: string
        nationalId?: string
        address?: {
          streetAddress?: string
          postalCode?: string
          city?: string
        }
      }
    }
    identity?: {
      data?: {
        name?: string
        nationalId?: string
        address?: {
          streetAddress?: string
          postalCode?: string
          city?: string
        }
      }
    }
    userProfile?: {
      data?: {
        email?: string
        mobilePhoneNumber?: string
      }
    }
  }
}

export const personalInformationSubsection = buildSubSection({
  id: Routes.PERSONALINFORMATION,
  title: m.personalInformation.title,
  children: [
    buildMultiField({
      id: 'applicant',
      title: m.personalInformation.title,
      description: m.partiesDetails.personalInformationDescription,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicantInformationMessages.labels.name,
          width: 'full',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.nationalRegistry?.data?.fullName ??
            application.externalData?.identity?.data?.name ??
            '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicantInformationMessages.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.nationalRegistry?.data?.nationalId ??
            application.externalData?.identity?.data?.nationalId ??
            '',
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicantInformationMessages.labels.address,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.streetAddress ??
            application.externalData?.identity?.data?.address?.streetAddress ??
            '',
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: applicantInformationMessages.labels.postalCode,
          width: 'half',
          format: '###',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode ??
            application.externalData?.identity?.data?.address?.postalCode ??
            '',
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicantInformationMessages.labels.city,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.nationalRegistry?.data?.address?.city ??
            application.externalData?.identity?.data?.address?.city ??
            '',
        }),
        buildTextField({
          id: 'applicant.email',
          title: applicantInformationMessages.labels.email,
          width: 'half',
          variant: 'email',
          backgroundColor: 'blue',
          required: true,
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.userProfile?.data?.email ?? '',
          maxLength: 100,
        }),
        buildTextField({
          id: 'applicant.phoneNumber',
          title: applicantInformationMessages.labels.tel,
          placeholder: '000-0000',
          format: '###-####',
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: ApplicantInformationInterface) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber ??
            '',
        }),
      ],
    }),
  ],
})
