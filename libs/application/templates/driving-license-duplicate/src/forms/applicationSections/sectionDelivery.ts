import {
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Jurisdiction } from '@island.is/clients/driving-license'

export const sectionDelivery = buildSection({
  id: 'delivery',
  title: m.deliveryMethodSectionTitle,
  children: [
    buildMultiField({
      id: 'deliverySection',
      title: m.deliveryMethodTitle,
      description: m.deliveryMethodDescription,
      children: [
        buildSelectField({
          id: 'district',
          title: m.deliveryMethodOfficeLabel,
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          required: true,
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
