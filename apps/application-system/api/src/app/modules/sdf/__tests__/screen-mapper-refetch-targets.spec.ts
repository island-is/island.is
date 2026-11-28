import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import { Application, FormItemTypes } from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

describe('mapScreenToComponents — inline refetch target metadata', () => {
  it('maps select and search refetch targets onto component DTOs', () => {
    const form = new FormBuilder('f', 'Form')
      .addSection('sec', 'Section', (section) => {
        section.addPage('page1', 'Page', (page) => {
          page
            .addSelectField('selectField', 'Select', {
              options: [{ label: 'One', value: 'one' }],
              isMulti: true,
              onSelectRefetch: ['getThing'],
              refetchTargets: ['dependentDisplay'],
            })
            .addSearchField('searchField', 'Search', {
              searchAction: 'searchThings',
              options: [],
              onSelectRefetch: ['getPropertyInfo'],
              refetchTargets: ['propertyInfoTable'],
            })
            .addDataTableField('tableField', 'Table', {
              header: ['A', 'B'],
              rows: [
                {
                  id: 'property',
                  cells: ['2223402', '010101'],
                  expandable: {
                    rows: [
                      {
                        id: '2223402_010102',
                        label: 'Sólstofa',
                        cells: ['010102'],
                        hasCheckbox: true,
                        inputs: [{ key: 'changedSize', type: 'number' }],
                        payload: {
                          propertyCode: 2223402,
                          unitCode: '010102',
                        },
                        defaultValues: {
                          changedSize: 17.1,
                          numOfRooms: 0,
                        },
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
    const multi = screens.find(
      (s): s is MultiFieldScreen =>
        'type' in s &&
        (s as { type: string }).type === FormItemTypes.MULTI_FIELD &&
        (s as MultiFieldScreen).id === 'page1',
    )

    expect(multi).toBeDefined()
    if (!multi) {
      throw new Error('Expected page1 multi field screen')
    }

    const resolver = {
      resolve: (v: unknown) =>
        typeof v === 'string' ? v : v != null ? String(v) : '',
    } as unknown as FormTextResolver

    const components = mapScreenToComponents(multi, resolver, {} as Application)
    const byId = (id: string) => components.find((c) => c.id === id)

    expect(byId('selectField')).toMatchObject({
      isMulti: true,
      onSelectRefetchTemplateApis: ['getThing'],
      refetchTargets: ['dependentDisplay'],
    })
    expect(byId('searchField')).toMatchObject({
      onSelectRefetchTemplateApis: ['getPropertyInfo'],
      refetchTargets: ['propertyInfoTable'],
    })
    expect(byId('tableField')?.rows).toMatchObject([
      {
        expandable: {
          rows: [
            {
              id: '2223402_010102',
              payload: {
                propertyCode: 2223402,
                unitCode: '010102',
              },
              defaultValues: {
                changedSize: 17.1,
                numOfRooms: 0,
              },
            },
          ],
        },
      },
    ])
  })
})
