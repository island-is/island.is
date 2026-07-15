import { SectionBuilder } from '@island.is/application/core'
import { addTableRepeaterSubsection } from './tableRepeaterSubsection'
import { staticTableSubsection } from './staticTableSubsection'
import { addFieldsRepeaterSubsection } from './fieldsrepeaterSubsection'
import { addPaginatedSearchableTableSubsection } from './paginatedSearchableTableSubsection'
import { addAccordionSubsection } from './accordionSubsection'

const tablesAndRepeatersSectionBuilder = new SectionBuilder(
  'tablesAndRepeatersSection',
  'Tables and repeaters',
)

addTableRepeaterSubsection(tablesAndRepeatersSectionBuilder)
addFieldsRepeaterSubsection(tablesAndRepeatersSectionBuilder)
addPaginatedSearchableTableSubsection(tablesAndRepeatersSectionBuilder)
addAccordionSubsection(tablesAndRepeatersSectionBuilder)

const tablesAndRepeatersSectionWithoutStaticTable =
  tablesAndRepeatersSectionBuilder.build()

export const tablesAndRepeatersSection = {
  ...tablesAndRepeatersSectionWithoutStaticTable,
  children: [
    staticTableSubsection,
    ...tablesAndRepeatersSectionWithoutStaticTable.children,
  ],
}
