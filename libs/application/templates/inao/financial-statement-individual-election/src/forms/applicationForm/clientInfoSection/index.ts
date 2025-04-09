import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application, UserProfile } from '@island.is/application/types'
import { Identity } from '@island.is/api/schema'

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
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.identity
              ?.data as Identity
            return nationalRegistry?.name
          },
        }),
        buildTextField({
          id: 'about.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) => {
            const userProfile = application.externalData?.userProfile
              ?.data as UserProfile
            return userProfile?.email
          },
        }),
        buildTextField({
          id: 'about.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          variant: 'tel',
          defaultValue: (application: Application) => {
            const userProfile = application.externalData?.userProfile
              ?.data as UserProfile
            return userProfile?.mobilePhoneNumber
          },
        }),
      ],
    }),
  ],
})
