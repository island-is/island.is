import {
  buildCustomField,
  buildKeyValueField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'

export const Overview = buildSubSection({
  id: 'machineType',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineTypeMultiField',
      title: overview.general.title,
      description: overview.general.description,
      children: [],
    }),
  ],
})
