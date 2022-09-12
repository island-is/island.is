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
import { DistrictCommissionerAgencies } from '../../types/schema'

export const sectionDelivery = buildSection({
  id: 'delivery',
  title: m.deliveryMethodSectionTitle,
  children: [
    buildMultiField({
      id: 'deliverySection',
      title: m.deliveryMethodSectionTitle,
      children: [
        buildDescriptionField({
          id: 'deliveryDescription',
          titleVariant: 'h3',
          title: m.deliveryMethodTitle,
          description: m.deliveryMethodDescription,
        }),
        buildSelectField({
          id: 'district',
          title: m.deliveryMethodOfficeLabel,
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          options: ({
            externalData: {
              districts: { data },
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
        }),
      ],
    }),
  ],
})
