import {
  Application,
  DataTableRow,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'

import { MainForm } from './index'

describe('RentalAgreementSdf MainForm', () => {
  it('builds the rental housing section with five SDF screens', () => {
    expect(MainForm.type).toBe(FormItemTypes.FORM)
    expect(MainForm.children).toHaveLength(1)

    const section = MainForm.children[0]
    expect(section.id).toBe('rentalHousing')
    expect(section.children).toHaveLength(5)
  })

  it('uses generic search and data table fields for property search', () => {
    const section = MainForm.children[0]
    const propertySearchSubsection = section.children[0]
    const propertySearchPage = propertySearchSubsection.children[0]
    const fieldTypes = propertySearchPage.children.map((field) => field.type)

    expect(fieldTypes).toEqual([
      FieldTypes.DESCRIPTION,
      FieldTypes.SEARCH,
      FieldTypes.DATA_TABLE,
      FieldTypes.DESCRIPTION,
    ])
    expect(propertySearchPage.children[1]).toMatchObject({
      type: FieldTypes.SEARCH,
      inlineRefetchTemplateApis: ['getPropertyInfo'],
      refetchTargets: ['propertyInfoTable'],
    })
    expect(propertySearchPage.children[2]).toMatchObject({
      id: 'propertyInfoTable',
      type: FieldTypes.DATA_TABLE,
    })
  })

  it('maps property units with payloads and default editable values', () => {
    const section = MainForm.children[0]
    const propertySearchSubsection = section.children[0]
    const propertySearchPage = propertySearchSubsection.children[0]
    const tableField = propertySearchPage.children[2] as unknown as {
      rows: (application: Application) => DataTableRow[]
    }
    const application = {
      answers: {},
      externalData: {
        getPropertyInfo: {
          data: {
            propertiesByAddressCode: [
              {
                propertyCode: 2223402,
                unitCode: '010101',
                size: 69.9,
                sizeUnit: 'm²',
                appraisalUnits: [
                  {
                    units: [
                      {
                        propertyUsageDescription: 'Sólstofa',
                        propertyCode: 2223402,
                        unitCode: '010102',
                        size: 17.1,
                        sizeUnit: 'm²',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    } as unknown as Application

    const rows = tableField.rows(application)
    const editableRow = rows[0].expandable?.rows[0]

    expect(rows[0].cells).toEqual(['2223402', '010101', '69.9 m²', ''])
    expect(editableRow).toMatchObject({
      id: '2223402_010102',
      label: 'Sólstofa',
      cells: ['010102'],
      payload: {
        propertyCode: 2223402,
        unitCode: '010102',
        size: 17.1,
        sizeUnit: 'm²',
      },
      defaultValues: {
        changedSize: 17.1,
        numOfRooms: 0,
      },
    })
  })
})
