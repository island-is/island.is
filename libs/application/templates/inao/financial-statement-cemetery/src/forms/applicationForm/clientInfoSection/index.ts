import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application, UserProfile } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import { ABOUTIDS } from '../../../../../shared/utils/constants'
import { Identity } from '@island.is/api/schema'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.info,
  children: [
    buildMultiField({
      id: 'about',
      title: m.info,
      description: m.reviewContact,
      children: [
        buildDescriptionField({
          id: ABOUTIDS.operatingYear,
          title: '',
        }),
        buildCustomField({
          id: 'OperatingYear',
          childInputIds: [ABOUTIDS.operatingYear],
          title: '',
          component: 'OperatingYear',
        }),
        buildTextField({
          id: 'about.nationalId',
          title: m.clientNationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'about.fullName',
          title: m.clientName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.identity
              .data as Identity
            return nationalRegistry.name
          },
        }),
        buildDescriptionField({
          id: ABOUTIDS.powerOfAttorneyName,
          title: '',
        }),
        buildCustomField({
          id: 'powerOfAttorney',
          title: '',
          description: '',
          component: 'PowerOfAttorneyFields',
          childInputIds: [
            ABOUTIDS.powerOfAttorneyNationalId,
            ABOUTIDS.powerOfAttorneyName,
          ],
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
        buildCustomField({
          id: 'delegation check',
          component: 'DelegationCheck',
          title: '',
        }),
      ],
    }),
  ],
})
