import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { examLocation, shared } from '../../../lib/messages'
import { PostCodeDto } from '@island.is/clients/practical-exams-ver'

export const examLocationSection = buildSection({
  id: 'examLocationSection',
  title: examLocation.general.sectionTitle,
  children: [
    buildMultiField({
      title: examLocation.general.pageTitle,
      id: 'examLocation',
      description: examLocation.general.pageDescription,
      children: [
        buildTextField({
          id: 'examLocation.address',
          title: shared.labels.address,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
        }),
        buildSelectField({
          id: 'examLocation.postalCode',
          title: shared.labels.postalCode,
          width: 'half',
          backgroundColor: 'blue',
          required: true,
          options: (application) => {
            const postCodes =
              getValueViaPath<PostCodeDto[]>(
                application.externalData,
                'postcodes.data',
              ) ?? []
            return postCodes.map((code) => {
              return {
                value: `${code.postCode}`,
                label: `${code.postCode} ${code.city}`,
              }
            })
          },
        }),
        buildDescriptionField({
          id: 'examLocation.descriptionField',
          title: examLocation.general.descriptionField,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
        }),
        buildTextField({
          id: 'examLocation.email',
          title: shared.labels.email,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
        }),
        buildPhoneField({
          id: 'examLocation.phone',
          title: shared.labels.phone,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
