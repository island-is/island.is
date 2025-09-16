import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { PICK_UP, SEND_HOME } from '../../lib/constants'
import { m } from '../../lib/messages'
import { Delivery } from '../../types'
import { DistrictCommissionerAgencies } from '@island.is/api/schema'

export const sectionDelivery = buildSection({
  id: 'delivery',
  title: m.deliveryMethodTitle,
  children: [
    buildMultiField({
      id: 'deliverySection',
      title: m.deliveryMethodTitle,
      children: [
        buildDescriptionField({
          id: 'deliveryDescription',
          description: m.deliveryMethodDescription,
        }),
        buildRadioField({
          id: 'delivery.deliveryMethod',
          width: 'half',
          disabled: false,
          options: [
            { value: SEND_HOME, label: m.deliveryMethodHomeDelivery },
            { value: PICK_UP, label: m.deliveryMethodPickUp },
          ],
          defaultValue: SEND_HOME,
        }),
        buildSelectField({
          id: 'delivery.district',
          title: m.deliveryMethodOfficeLabel,
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          options: ({
            externalData: {
              districtCommissioners: { data },
            },
          }) => {
            return (data as DistrictCommissionerAgencies[]).map(
              ({ name, place, address }) => ({
                value: `${name}, ${place}`,
                label: `${name}, ${place}`,
                tooltip: `${address}`,
              }),
            )
          },
          condition: (answers: FormValue) =>
            (answers.delivery as Delivery)?.deliveryMethod === PICK_UP,
        }),
      ],
    }),
  ],
})
