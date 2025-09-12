import { Fragment } from 'react'
import { PropertyTableRow } from './PropertyTableRow'
import { PropertyTableUnits } from './PropertyTableUnits'
import { PropertyUnit } from '../../../shared/types'
import { Table } from '@island.is/island-ui/core'
import { HmsPropertyInfo } from '@island.is/api/schema'

type Props = {
  propertiesByAddressCode: Array<HmsPropertyInfo> | undefined
  tableExpanded: Record<string, boolean>
  toggleExpand: (propertyId: number) => void
  checkedUnits: Record<string, boolean>
  numOfRoomsValue: Record<string, number>
  unitSizeChangedValue: Record<string, number>
  handleCheckboxChange: (unit: PropertyUnit, checked: boolean) => void
  handleUnitChange: (
    unit: PropertyUnit,
    keyToUpdate: keyof PropertyUnit,
    value: string,
  ) => void
  errors: Record<string, Record<string, string>>
}

export const PropertyTableBody = ({
  propertiesByAddressCode,
  tableExpanded,
  toggleExpand,
  checkedUnits,
  numOfRoomsValue,
  unitSizeChangedValue,
  handleCheckboxChange,
  handleUnitChange,
  errors,
}: Props) => {
  if (!propertiesByAddressCode) return null

  return (
    <Table.Body>
      {propertiesByAddressCode
        .map((property) => {
          // Appraisal units are array of objects of length 1, maybe it can be more in some cases.
          // The objects have the attribute 'units' which is what we want to loop over for each fasteignanumer
          const flatAppraisalUnits =
            property.appraisalUnits?.flatMap((au) => au.units ?? []) ?? []

          if (flatAppraisalUnits.length === 0) return null

          return (
            <Fragment key={property.propertyCode}>
              <PropertyTableRow
                appraisalUnits={property.appraisalUnits || []}
                propertyCode={property.propertyCode || 0}
                unitCode={property.unitCode || ''}
                size={property.size || 0}
                sizeUnit={property.sizeUnit || ''}
                isTableExpanded={
                  property.propertyCode != null
                    ? tableExpanded[property.propertyCode] || false
                    : false
                }
                toggleExpand={(e) => {
                  e.preventDefault()
                  toggleExpand(property.propertyCode || 0)
                }}
              />
              {flatAppraisalUnits.map((unit) => {
                if (!unit) return null

                const unitKey = `${unit.propertyCode}_${unit.unitCode}`
                return (
                  <PropertyTableUnits
                    key={unitKey}
                    unitCode={unit.unitCode ?? ''}
                    propertyUsageDescription={
                      unit.propertyUsageDescription ?? ''
                    }
                    sizeUnit={unit.sizeUnit ?? ''}
                    checkedUnits={checkedUnits[unitKey] || false}
                    isTableExpanded={
                      tableExpanded[unit.propertyCode ?? 0] || false
                    }
                    unitSizeValue={
                      unitSizeChangedValue[unitKey] ?? unit.size ?? 0
                    }
                    numOfRoomsValue={numOfRoomsValue[unitKey] ?? 0}
                    isUnitSizeDisabled={!checkedUnits[unitKey]}
                    isNumOfRoomsDisabled={!checkedUnits[unitKey]}
                    onCheckboxChange={(e) =>
                      handleCheckboxChange(unit, e.currentTarget.checked)
                    }
                    onUnitSizeChange={(e) =>
                      handleUnitChange(unit, 'changedSize', e.target.value)
                    }
                    onUnitRoomsChange={(e) =>
                      handleUnitChange(unit, 'numOfRooms', e.target.value)
                    }
                    unitInputErrorMessage={
                      errors?.registerProperty?.[`searchresults.units`]
                    }
                  />
                )
              })}
            </Fragment>
          )
        })
        .filter(Boolean)}
    </Table.Body>
  )
}
