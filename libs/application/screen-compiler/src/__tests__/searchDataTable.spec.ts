import { FormBuilder } from '@island.is/application/core'
import { FieldTypes } from '@island.is/application/types'

import { convertFormToScreens } from '../convertFormToScreens'
import type { MultiFieldScreen } from '../types'

describe('search and data table screens', () => {
  it('keeps generic search and data table fields in the compiled screen', () => {
    const form = new FormBuilder('testForm', 'Test form')
      .addSection('section', 'Section', (section) => {
        section.addPage('page', 'Page', (page) => {
          page
            .addSearchField('search', 'Search', {
              searchAction: 'searchThings',
              options: [],
              onSelectRefetch: ['getThing'],
              refetchTargets: ['table'],
            })
            .addDataTableField('table', 'Table', {
              header: ['A', 'B'],
              rows: [
                {
                  id: 'row-1',
                  cells: ['one', 'two'],
                  expandable: {
                    rows: [
                      {
                        id: 'unit-1',
                        label: 'Unit 1',
                        hasCheckbox: true,
                        inputs: [{ key: 'rooms', type: 'number', min: 0 }],
                      },
                    ],
                  },
                },
              ],
            })
        })
      })
      .build()

    const screens = convertFormToScreens(form, {}, {}, null)
    expect(screens).toHaveLength(1)
    const screen = screens[0] as MultiFieldScreen
    expect(screen.children.map((field) => field.type)).toEqual([
      FieldTypes.SEARCH,
      FieldTypes.DATA_TABLE,
    ])
    expect(screen.children[0]).toMatchObject({
      inlineRefetchTemplateApis: ['getThing'],
      refetchTargets: ['table'],
    })
  })
})
