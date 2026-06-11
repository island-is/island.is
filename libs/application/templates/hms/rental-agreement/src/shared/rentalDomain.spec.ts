import { FieldTypes } from '@island.is/application/types'

import {
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  EmergencyExitOptions,
} from './rentalDomain'
import { RentalHousingCategoryClass } from './enums'
import {
  calculateRentalPropertySize,
  hasRentalUnitSizeChanged,
  mapRentalPropertyInfoToRows,
  mapRentalPropertyInfo,
  requiredSmokeDetectorCount,
  shouldShowFireExtinguisherAlert,
  shouldShowSmokeDetectorAlert,
} from './rentalDomain'

describe('rentalDomain', () => {
  it('exports HMS-facing enum values as the canonical rental values', () => {
    expect(RentalHousingCategoryTypes.ENTIRE_HOME).toBe('House_Apartment')
    expect(RentalHousingCategoryTypes.ROOM).toBe('Room')
    expect(RentalHousingCategoryTypes.COMMERCIAL).toBe('Commercial')
    expect(RentalHousingCategoryClass.SPECIAL_GROUPS).toBe('specialGroups')
    expect(RentalHousingConditionInspector.CONTRACT_PARTIES).toBe(
      'ContractParties',
    )
    expect(RentalHousingConditionInspector.INDEPENDENT_PARTY).toBe(
      'Indipendant',
    )
    expect(EmergencyExitOptions.YES).toBe('1')
    expect(EmergencyExitOptions.NO).toBe('0')
  })

  it('maps HMS property info into data-table rows with editable unit payloads', () => {
    const property = mapRentalPropertyInfo({
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
    })

    const rows = mapRentalPropertyInfoToRows([property], {
      sizeLabel: 'Stærð',
      roomsLabel: 'Fjöldi herbergja',
    })
    const editableRow = rows[0].expandable?.rows[0]

    expect(rows[0].cells).toEqual(['2223402', '010101', '69.9 m²', ''])
    expect(editableRow).toMatchObject({
      id: '2223402_010102',
      label: 'Sólstofa',
      cells: ['010102'],
      hasCheckbox: true,
      checkboxKey: 'checked',
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
    expect(editableRow?.inputs?.[0]).toMatchObject({
      key: 'changedSize',
      type: 'number',
      label: 'Stærð',
      min: 0,
      suffix: 'm²',
    })
    expect(editableRow?.inputs?.[1]).toMatchObject({
      key: 'numOfRooms',
      type: 'number',
      label: 'Fjöldi herbergja',
      min: 0,
    })
    expect(rows[0].type).toBeUndefined()
    expect(FieldTypes.DATA_TABLE).toBe('DATA_TABLE')
  })

  it('calculates selected rental size from changed unit sizes', () => {
    const selectedUnits = [
      { checked: true, size: 50, changedSize: 55 },
      { checked: true, size: 30 },
      { checked: false, size: 100, changedSize: 100 },
    ]

    expect(calculateRentalPropertySize(selectedUnits)).toBe(85)
    expect(hasRentalUnitSizeChanged(selectedUnits)).toBe(true)
  })

  it('computes fire-safety alert thresholds from selected property size', () => {
    expect(requiredSmokeDetectorCount(0)).toBe(0)
    expect(requiredSmokeDetectorCount(1)).toBe(1)
    expect(requiredSmokeDetectorCount(80)).toBe(1)
    expect(requiredSmokeDetectorCount(81)).toBe(2)
    expect(shouldShowSmokeDetectorAlert(81, '1')).toBe(true)
    expect(shouldShowSmokeDetectorAlert(81, '2')).toBe(false)
    expect(shouldShowFireExtinguisherAlert('0')).toBe(true)
    expect(shouldShowFireExtinguisherAlert('1')).toBe(false)
  })
})
