import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildDateField,
  getValueViaPath,
} from '@island.is/application/core'
import { Address, Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'

export const sectionInformationActor = buildSection({
  id: 'information',
  title: m.informationSectionTitle,
  children: [
    buildMultiField({
      id: 'list',
      title: m.informationActorTitle,
      description: m.informationSubtitle,
      children: [
        buildTextField({
          id: 'name',
          title: m.applicantsName,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const fullName = getValueViaPath<string>(
              application.externalData,
              'nationalRegistry.data.fullName',
            )
            return fullName
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
            const streetAddress = getValueViaPath<string>(
              application.externalData,
              'nationalRegistry.data.address.streetAddress',
            )
            return streetAddress
          },
        }),
        buildTextField({
          id: 'city',
          title: m.applicantsCity,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const address = getValueViaPath<Address>(
              application.externalData,
              'nationalRegistry.data.address',
            )
            return `${address?.postalCode}, ${address?.locality}`
          },
        }),
        buildTextField({
          id: 'email',
          title: m.applicantsActorEmail,
          variant: 'email',
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: Application) => {
            const email = getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            )
            return email
          },
        }),
        buildTextField({
          id: 'phone',
          title: m.applicantsActorPhoneNumber,
          variant: 'tel',
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: Application) => {
            const phone = getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            )
            return phone
          },
        }),
        buildDateField({
          id: 'validityPeriod',
          title: m.cardValidityPeriod,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            const expirationDate = getValueViaPath<string>(
              application.externalData,
              'doctorsNote.data.expirationDate',
            )
            return expirationDate
          },
        }),
      ],
    }),
  ],
})
