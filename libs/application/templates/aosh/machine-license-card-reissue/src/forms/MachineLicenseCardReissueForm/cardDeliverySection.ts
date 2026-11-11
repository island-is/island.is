import {
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { cardDelivery } from '../../lib/messages'
import { AddressDeliveryType } from '../../shared'
import { getLegalDomicileAddress } from '../../utils'

const isOtherAddress = (answers: FormValue) =>
  getValueViaPath<AddressDeliveryType>(answers, 'cardDelivery.type') ===
  AddressDeliveryType.OTHER

export const cardDeliverySection = buildSection({
  id: 'cardDeliverySection',
  title: cardDelivery.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'cardDeliveryMultiField',
      title: cardDelivery.general.pageTitle,
      description: cardDelivery.general.description,
      children: [
        buildHiddenInput({
          id: 'cardDelivery.currentAddress',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address',
              {},
            ),
        }),
        buildRadioField({
          id: 'cardDelivery.type',
          backgroundColor: 'blue',
          largeButtons: true,
          required: true,
          defaultValue: (application: Application) =>
            getLegalDomicileAddress(application.externalData)
              ? AddressDeliveryType.CURRENT
              : AddressDeliveryType.OTHER,
          options: (application: Application) => {
            const address = getLegalDomicileAddress(application.externalData)
            return [
              {
                value: AddressDeliveryType.CURRENT,
                label: address
                  ? {
                      ...cardDelivery.labels.currentAddress,
                      values: { address },
                    }
                  : cardDelivery.labels.currentAddressNoAddress,
                disabled: !address,
              },
              {
                value: AddressDeliveryType.OTHER,
                label: cardDelivery.labels.otherAddress,
              },
            ]
          },
        }),
        buildTextField({
          id: 'cardDelivery.address',
          title: cardDelivery.labels.address,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: isOtherAddress,
        }),
        buildTextField({
          id: 'cardDelivery.postalCodeAndCity',
          title: cardDelivery.labels.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: isOtherAddress,
        }),
        buildTextField({
          id: 'cardDelivery.recipient',
          title: cardDelivery.labels.recipient,
          backgroundColor: 'blue',
          condition: isOtherAddress,
        }),
      ],
    }),
  ],
})
