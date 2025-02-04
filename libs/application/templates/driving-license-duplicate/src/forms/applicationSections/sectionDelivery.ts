import {
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  getValueViaPath,
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
        buildRadioField({
          id: 'delivery.deliveryMethod',
          title: 'Hvernig vilt þú fá plastökuskírteinið þitt afhent?',
          defaultValue: '1',
          width: 'half',
          options: [
            { value: '1', label: 'Sent heim í pósti' },
            { value: '2', label: 'Sækja á afhendingarstað' },
          ],
        }),
        buildSelectField({
          id: 'delivery.district',
          title: 'Veldu afhendingarstað',
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          required: true,
          condition: (answers) =>
            getValueViaPath(answers, 'delivery.deliveryMethod') === '2',
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
