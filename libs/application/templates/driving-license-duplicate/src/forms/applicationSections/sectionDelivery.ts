import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DistrictCommissionerAgencies } from '@island.is/api/schema'

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
          marginBottom: 2,
          description: m.deliveryMethodDescription,
        }),
        buildSelectField({
          id: 'district',
          title: m.deliveryMethodOfficeLabel,
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          options: ({
            externalData: {
              districtCommissioners: { data },
            },
          }) => {
            return (data as DistrictCommissionerAgencies[]).map(
              ({ id, name, place, address }) => ({
                value: id,
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
