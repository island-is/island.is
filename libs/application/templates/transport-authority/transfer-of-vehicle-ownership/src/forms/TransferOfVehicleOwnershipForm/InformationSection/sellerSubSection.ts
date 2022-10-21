import {
  buildMultiField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { TransferOfVehicleOwnership } from '../../../lib/dataSchema'

export const sellerSubSection = buildSubSection({
  id: 'seller',
  title: 'Seljandi',
  children: [
    buildMultiField({
      id: 'sellerMultiField',
      title: information.labels.seller.title,
      description: information.general.description,
      children: [
        buildTextField({
          id: 'seller.nationalId',
          title: information.labels.seller.nationalId,
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
          format: '######-####',
          required: true,
          defaultValue: (application: TransferOfVehicleOwnership) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'seller.name',
          title: information.labels.seller.name,
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
          required: true,
          defaultValue: (application: TransferOfVehicleOwnership) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'seller.phone',
          title: information.labels.seller.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
          defaultValue: (application: TransferOfVehicleOwnership) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber,
        }),
        buildTextField({
          id: 'seller.email',
          title: information.labels.seller.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: TransferOfVehicleOwnership) =>
            application.externalData?.userProfile?.data?.email,
        }),
      ],
    }),
  ],
})
