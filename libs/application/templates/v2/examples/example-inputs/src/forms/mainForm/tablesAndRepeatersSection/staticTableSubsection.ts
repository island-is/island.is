import { PageBuilder } from '@island.is/application/core'
import { FormItemTypes, SubSection } from '@island.is/application/types'

const staticTablePage = new PageBuilder('', '')

staticTablePage.addStaticTableField('', 'Static table', {
  // Header, rows and summary can also be functions that access external data or answers
  header: [
    'Table heading 1',
    'Table heading 2',
    'Table heading 3',
    'Table heading 4',
  ],
  rows: [
    [
      'Row 1, Column 1',
      'Row 1, Column 2',
      'Row 1, Column 3',
      'Row 1, Column 4',
    ],
    [
      'Row 2, Column 1',
      'Row 2, Column 2',
      'Row 2, Column 3',
      'Row 2, Column 4',
    ],
    [
      'Row 3, Column 1',
      'Row 3, Column 2',
      'Row 3, Column 3',
      'Row 3, Column 4',
    ],
  ],
  // Summary is optional
  summary: [
    {
      label: 'Summary label',
      value: 'Summary value',
    },
  ],
})

export const staticTableSubsection: SubSection = {
  id: 'staticTableSubsection',
  title: 'Static table',
  type: FormItemTypes.SUB_SECTION,
  children: staticTablePage.build().children,
}
