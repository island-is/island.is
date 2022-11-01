import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '../../../types/schema'

export const sellerSubSection = buildSubSection({
  id: 'seller',
  title: 'Seljandi',
  children: [
    buildMultiField({
      id: 'sellerMultiField',
      title: information.labels.seller.title,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'seller.mainSeller',
          title: information.labels.seller.subtitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'seller.nationalId',
          title: information.labels.seller.nationalId,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'seller.name',
          title: information.labels.seller.name,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'seller.email',
          title: information.labels.seller.email,
          width: 'full',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildCustomField({
          id: 'coOwner',
          title: '',
          component: 'CoOwner',
        }),
      ],
    }),
  ],
})
