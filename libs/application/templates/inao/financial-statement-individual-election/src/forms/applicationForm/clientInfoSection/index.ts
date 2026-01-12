import {
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.info,
  children: [
    buildMultiField({
      id: 'about',
      title: m.info,
      description: m.reviewInfo,
      children: [
        buildTextField({
          id: 'about.nationalId',
          title: m.candidateNationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'about.fullName',
          title: m.candidateFullName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            ),
        }),
        buildTextField({
          id: 'about.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ),
        }),
        buildTextField({
          id: 'about.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
        }),
      ],
    }),
  ],
})
