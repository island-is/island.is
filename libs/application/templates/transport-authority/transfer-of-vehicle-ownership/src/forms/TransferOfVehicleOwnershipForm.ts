import { Application } from '@island.is/application/types'
import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildDateField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { information, externalData, forPayment } from '../lib/messages'
import { m } from '../lib/messagess'
import { TransferOfVehicleOwnership } from '../lib/dataSchema'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'informationMultiField',
          title: information.general.pageTitle,
          description: information.general.description,
          children: [
            buildDescriptionField({
              id: 'pickVehicle.title',
              title: information.labels.pickVehicle.title,
              titleVariant: 'h5',
            }),
            buildCustomField({
              id: 'pickVehicle.plate',
              component: 'VehicleSelectField',
              title: '',
            }),
            buildDescriptionField({
              id: 'vehicle.title',
              title: information.labels.vehicle.title,
              titleVariant: 'h5',
              space: 3,
            }),
            buildTextField({
              id: 'vehicle.plate',
              title: information.labels.vehicle.plate,
              backgroundColor: 'white',
              width: 'half',
              disabled: true,
              required: true,
            }),
            buildTextField({
              id: 'vehicle.type',
              title: information.labels.vehicle.type,
              backgroundColor: 'white',
              width: 'half',
              disabled: true,
              required: true,
            }),
            buildTextField({
              id: 'vehicle.salePrice',
              title: information.labels.vehicle.salePrice,
              width: 'half',
            }),
            buildDateField({
              id: 'vehicle.date',
              title: information.labels.vehicle.date,
              width: 'half',
              minDate: () => {
                const today = new Date()
                // Maybe have option if buyer to have sellers date.
                return today
              },
            }),
            // Seller
            buildDescriptionField({
              id: 'seller.title',
              title: information.labels.seller.title,
              titleVariant: 'h5',
              space: 3,
            }),
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
            // Co-owner only visible if there is a coowner.
            buildDescriptionField({
              id: 'coOwner.title',
              title: information.labels.coOwner.title,
              titleVariant: 'h5',
              space: 3,
            }),
            buildTextField({
              id: 'coOwner.nationalId',
              title: information.labels.coOwner.nationalId,
              backgroundColor: 'white',
              width: 'half',
              disabled: true,
              format: '######-####',
              required: true,
            }),
            buildTextField({
              id: 'coOwner.name',
              title: information.labels.coOwner.name,
              backgroundColor: 'white',
              width: 'half',
              disabled: true,
              required: true,
            }),
            buildTextField({
              id: 'coOwner.phone',
              title: information.labels.coOwner.phone,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              required: true,
            }),
            buildTextField({
              id: 'coOwner.email',
              title: information.labels.coOwner.email,
              width: 'half',
              variant: 'email',
              required: true,
            }),
            // Buyer
            buildDescriptionField({
              id: 'buyer.title',
              title: information.labels.buyer.title,
              titleVariant: 'h5',
              space: 3,
            }),
            // Buyer name and nationalId
            buildCustomField({
              id: 'buyer',
              component: 'NationalIdWithName',
              title: '',
            }),
            buildTextField({
              id: 'buyer.phone',
              title: information.labels.buyer.phone,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              required: true,
            }),
            buildTextField({
              id: 'buyer.email',
              title: information.labels.buyer.email,
              width: 'half',
              variant: 'email',
              required: true,
            }),
          ],
        }),
        /* buildSubSection({
          id: 'test',
          title: 'Test',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }), */
      ],
    }),
    buildSection({
      id: 'payment',
      title: forPayment.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'paymentMultiField',
          title: forPayment.general.pageTitle,
          children: [
            buildCustomField({
              component: 'ForPayment',
              id: 'ForPayment',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'ConfirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
