import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { ABOUTIDS } from '../../../utils/constants'
import { Application, UserProfile } from '@island.is/application/types'
import { Identity } from '@island.is/clients/identity'

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
        }),
        buildCustomField({
          id: 'OperatingYear',
          childInputIds: [ABOUTIDS.operatingYear],
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
        }),
        buildCustomField({
          id: 'powerOfAttorney',
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
      ],
    }),
  ],
})
