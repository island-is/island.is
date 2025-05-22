import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { plateDelivery } from '../../../lib/messages/plateDelivery'
import { AddressDeliveryType, CurrentAddress } from '../../../shared'
import { Application as ApplicationSchema } from '@island.is/api/schema'
import { Application } from '@island.is/application/types'

export const plateDeliverySubSection = buildSubSection({
  id: 'plateDeliverySubSection',
  title: plateDelivery.general.title,
  children: [
    buildMultiField({
      id: 'plateDelivery',
      title: plateDelivery.general.title,
      description: plateDelivery.general.description,
      children: [
        buildHiddenInput({
          id: 'plateDelivery.currentAddress',
          defaultValue: (application: ApplicationSchema) => {
            return application.externalData.identity.data?.address || {}
          },
        }),
        buildRadioField({
          id: 'plateDelivery.type',
          title: plateDelivery.general.radioTitle,
          backgroundColor: 'white',
          options: [
            {
              value: AddressDeliveryType.CURRENT,
              label: plateDelivery.labels.currentAddress,
              subLabel: (application: Application) => {
                const address = getValueViaPath(
                  application.externalData,
                  'identity.data.address',
                  {},
                ) as CurrentAddress
                if (Object.entries(address).length === 0) {
                  return ''
                }
                return `${address.streetAddress}, ${address.postalCode} ${address.city}`
              },
            },
            {
              value: AddressDeliveryType.OTHER,
              label: plateDelivery.labels.otherAddress,
              subLabel: '',
            },
          ],
          defaultValue: AddressDeliveryType.CURRENT,
          largeButtons: true,
          width: 'half',
        }),
        buildTextField({
          id: 'plateDelivery.address',
          title: plateDelivery.labels.addressLabel,
          width: 'half',
          variant: 'text',
          placeholder: plateDelivery.labels.addressPlaceholder,
          condition: (answers) => {
            const delivery = getValueViaPath(
              answers,
              'plateDelivery.type',
              '',
            ) as string

            return delivery === AddressDeliveryType.OTHER
          },
          required: true,
        }),
        buildTextField({
          id: 'plateDelivery.postalCode',
          title: plateDelivery.labels.postCodeLabel,
          width: 'half',
          variant: 'text',
          condition: (answers) => {
            const delivery = getValueViaPath(
              answers,
              'plateDelivery.type',
              '',
            ) as string
            return delivery === AddressDeliveryType.OTHER
          },
          required: true,
        }),
        buildTextField({
          id: 'plateDelivery.city',
          title: plateDelivery.labels.cityLabel,
          width: 'half',
          variant: 'text',
          condition: (answers) => {
            const delivery = getValueViaPath(
              answers,
              'plateDelivery.type',
              '',
            ) as string
            return delivery === AddressDeliveryType.OTHER
          },
          required: true,
        }),
        buildTextField({
          id: 'plateDelivery.recipient',
          title: plateDelivery.labels.recepientLabel,
          width: 'half',
          variant: 'text',
          condition: (answers) => {
            const delivery = getValueViaPath(
              answers,
              'plateDelivery.type',
              '',
            ) as string
            return delivery === AddressDeliveryType.OTHER
          },
          required: true,
        }),
      ],
    }),
  ],
})
