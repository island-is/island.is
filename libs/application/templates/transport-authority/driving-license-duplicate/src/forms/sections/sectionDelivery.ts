import {
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Jurisdiction } from '@island.is/clients/driving-license'
import { Delivery } from '../../lib/constants'

export const sectionDelivery = buildSection({
  id: 'delivery',
  title: m.deliveryMethodSectionTitle,
  children: [
    buildMultiField({
      id: 'deliverySection',
      title: m.deliveryMethodTitle,
      description: m.deliveryMethodDescription,
      children: [
        buildRadioField({
          id: 'delivery.deliveryMethod',
          title: m.deliveryMethodHeader,
          defaultValue: Delivery.SEND_HOME,
          width: 'half',
          options: [
            { value: Delivery.SEND_HOME, label: m.deliverySendHome },
            { value: Delivery.PICKUP, label: m.deliveryPickup },
          ],
        }),
        buildSelectField({
          id: 'delivery.district',
          title: m.deliveryPickupLocation,
          placeholder: m.deliveryPickupLocationPlaceholder,
          required: true,
          condition: (answers) =>
            getValueViaPath(answers, 'delivery.deliveryMethod') ===
            Delivery.PICKUP,
          options: ({
            externalData: {
              jurisdictions: { data },
            },
          }) => {
            return (data as Jurisdiction[])
              .map(({ id, zip, name }) => ({
                value: id.toString(),
                label: `${zip} ${name}`,
              }))
              .sort((a, b) => parseInt(a.label, 10) - parseInt(b.label, 10))
          },
        }),
      ],
    }),
  ],
})
