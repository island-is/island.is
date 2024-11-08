import { buildSection, buildKeyValueField } from '@island.is/application/core'
import { buildMultiField } from 'libs/application/core/src/lib/formBuilders'

export const keyValueSection = buildSection({
  id: 'keyValueSection',
  title: 'Key-Value',
  children: [
    buildMultiField({
      id: 'keyValueMultiField',
      title: 'Key-Value',
      children: [
        buildKeyValueField({
          label: 'Key value label',
          value: 'One value',
        }),
        buildKeyValueField({
          label: 'Key value with divider',
          value: ['Many values', 'Value 2', 'Value 3'],
          divider: true,
        }),
        buildKeyValueField({
          label: 'Key value displax flex',
          value: ['Value', 'Value 2', 'Value 3'],
          divider: true,
          display: 'flex',
        }),
        buildKeyValueField({
          label: 'Key value half width',
          value: 'One value',
          divider: true,
          width: 'half',
        }),
        buildKeyValueField({
          label: 'Key value half width',
          value: 'Custom colspan',
          divider: true,
          width: 'half',
          colSpan: '5/12',
        }),
      ],
    }),
  ],
})
