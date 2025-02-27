import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildPhoneField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import { Application } from '@island.is/api/schema'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'informationMultiField',
      title: information.general.title,
      description: information.general.description,
      children: [
        buildTextField({
          id: 'information.nationalId',
          title: information.labels.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
              '',
            ),
        }),
        buildTextField({
          id: 'information.name',
          title: information.labels.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
              '',
            ),
        }),
        buildTextField({
          id: 'information.address',
          title: information.labels.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.address.streetAddress',
              '',
            ),
        }),
        buildTextField({
          id: 'information.postCode',
          title: information.labels.postCode,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.address.postalCode',
              '105',
            ),
        }),
        buildTextField({
          id: 'information.email',
          title: information.labels.email,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
              '',
            ),
        }),
        buildPhoneField({
          id: 'information.phone',
          title: information.labels.phone,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
              '',
            ),
        }),
      ],
    }),
  ],
})
