import { buildSection } from '@island.is/application/core'
import { tableRepeaterSubsection } from './tableRepeaterSubsection'
import { staticTableSubsection } from './staticTableSubsection'
import { fieldsRepeaterSubsection } from './fieldsrepeaterSubsection'
import { paginatedSearchableTableSubsection } from './paginatedSearchableTableSubsection'

export const tablesAndRepeatersSection = buildSection({
  id: 'tablesAndRepeatersSection',
  title: 'Tables and repeaters',
  children: [
    staticTableSubsection,
    tableRepeaterSubsection,
    fieldsRepeaterSubsection,
    paginatedSearchableTableSubsection,
  ],
})
