import {
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import * as m from '../../../lib/messages'
import {
  nationalIdPreface,
  getAssigneeNationalRegistryData,
  getAssigneeUserProfileData,
} from '../../../utils/assigneeUtils'
import { doesAssigneeAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'

const labels = applicantInformationMessages.labels

export const personalInformationSection = buildSection({
  condition: (answers, externalData) =>
    doesAssigneeAddressMatchRentalContract(answers, externalData),
  id: 'personalInformationSection',
  title: m.assigneeDraft.title,
  children: [
    buildMultiField({
      id: (application, user) =>
        nationalIdPreface(application, user, 'assigneeInfo'),
      title: m.assigneeDraft.title,
      children: [
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.name'),
          title: labels.name,
          width: 'full',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            (getAssigneeNationalRegistryData(application) as any)?.fullName ??
            '',
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.nationalId'),
          title: labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            (getAssigneeNationalRegistryData(application) as any)?.nationalId ??
            '',
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.address'),
          title: labels.address,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            (getAssigneeNationalRegistryData(application) as any)?.address
              ?.streetAddress ?? '',
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.postalCode'),
          title: labels.postalCode,
          format: '###',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            (getAssigneeNationalRegistryData(application) as any)?.address
              ?.postalCode ?? '',
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.city'),
          title: labels.city,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            (getAssigneeNationalRegistryData(application) as any)?.address
              ?.city ?? '',
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.email'),
          title: labels.email,
          width: 'half',
          variant: 'email',
          backgroundColor: 'blue',
          required: true,
          defaultValue: (application: Application) =>
            (getAssigneeUserProfileData(application) as any)?.email ?? '',
          maxLength: 100,
        }),
        buildPhoneField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeInfo.phoneNumber'),
          title: labels.tel,
          width: 'half',
          backgroundColor: 'blue',
          required: true,
          defaultValue: (application: Application) =>
            (getAssigneeUserProfileData(application) as any)
              ?.mobilePhoneNumber ?? '',
        }),
      ],
    }),
  ],
})
