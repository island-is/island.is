import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildDateField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { UserProfile } from '@island.is/api/schema'

export const sectionInformation = buildSection({
  id: 'information',
  title: m.informationSectionTitle,
  children: [
    buildMultiField({
      id: 'list',
      title: m.informationTitle,
      description: m.informationSubtitle,
      children: [
        buildTextField({
          id: 'name',
          title: m.applicantsName,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User
            return nationalRegistry.fullName
          },
        }),
        buildTextField({
          id: 'nationalId',
          title: m.applicantsNationalId,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildTextField({
          id: 'address',
          title: m.applicantsAddress,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User
            return nationalRegistry.address.streetAddress
          },
        }),
        buildTextField({
          id: 'city',
          title: m.applicantsCity,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User
            return (
              nationalRegistry.address.postalCode +
              ', ' +
              nationalRegistry.address.city
            )
          },
        }),
        buildTextField({
          id: 'email',
          title: m.applicantsEmail,
          variant: 'email',
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: Application) => {
            const data = application.externalData.userProfile
              .data as UserProfile
            return data.email
          },
        }),
        buildTextField({
          id: 'phone',
          title: m.applicantsPhoneNumber,
          variant: 'tel',
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: Application) => {
            const data = application.externalData.userProfile
              .data as UserProfile
            return data.mobilePhoneNumber
          },
        }),
        buildDateField({
          id: 'validityPeriod',
          title: m.cardValidityPeriod,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const data = application.externalData.doctorsNote.data as any
            return data?.expirationDate
          },
        }),
      ],
    }),
  ],
})
