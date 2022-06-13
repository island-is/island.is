import {
  Application,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import type { User } from '@island.is/api/domains/national-registry'
import { UserProfile } from '../../../types/schema'
import { m } from '../../../lib/messages'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.infoSection,
  children: [
    buildMultiField({
      id: 'about',
      title: m.about,
      description: m.reviewContact,
      children: [
        buildTextField({
          id: 'about.nationalId',
          title: m.nationalId,
          width: 'half',
          format: '######-####',
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'about.fullName',
          title: m.fullName,
          width: 'half',
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User
            return nationalRegistry.fullName
          },
        }),
        buildTextField({
          id: 'about.powerOfAttorneyNationalId',
          title: m.powerOfAttorneyNationalId,
          format: '######-####',
          width: 'half',
        }),
        buildTextField({
          id: 'about.powerOfAttorneyName',
          title: m.powerOfAttorneyName,
          width: 'half',
        }),
        buildTextField({
          id: 'about.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) => {
            const userProfile = application.externalData.userProfile
              .data as UserProfile
            return userProfile.email
          },
        }),
        buildTextField({
          id: 'about.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          variant: 'tel',
          defaultValue: (application: Application) => {
            const userProfile = application.externalData.userProfile
              .data as UserProfile
            return userProfile.mobilePhoneNumber
          },
        }),
      ],
    }),
  ],
})
