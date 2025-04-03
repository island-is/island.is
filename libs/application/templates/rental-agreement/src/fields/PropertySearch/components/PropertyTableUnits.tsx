import { Checkbox, Table as T } from '@island.is/island-ui/core'
import {
  hiddenTableRow,
  hiddenTableRowExpanded,
  tableCellExpand,
  dropdownTableCell,
  tableCellMerking,
  tableCellSize,
  tableCellNumOfRooms,
  input,
  sizeInput,
  roomsInput,
  tableCellFastNum,
} from '../propertySearch.css'

interface PropertyUnitsProps {
  unitCode: string | undefined
  propertyUsageDescription: string | undefined
  sizeUnit: string | undefined
  checkedUnits: boolean
  isTableExpanded: boolean
  unitSizeValue: string | number | undefined
  numOfRoomsValue: string | number | undefined
  isUnitSizeDisabled: boolean
  isNumOfRoomsDisabled: boolean
  onCheckboxChange:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
  onUnitSizeChange:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
  onUnitRoomsChange:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
}

export const PropertyTableUnits = ({
  unitCode,
  propertyUsageDescription,
  sizeUnit,
  checkedUnits,
  isTableExpanded,
  unitSizeValue,
  numOfRoomsValue,
  isUnitSizeDisabled,
  isNumOfRoomsDisabled,
  onCheckboxChange,
  onUnitSizeChange,
  onUnitRoomsChange,
}: PropertyUnitsProps) => {
  return (
    <tr key={unitCode}>
      <T.Data
        colSpan={5}
        box={{
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderColor: 'transparent',
        }}
      >
        <div
          className={`${hiddenTableRow} ${
            isTableExpanded && hiddenTableRowExpanded
          }`}
        >
          <T.Data
            box={{
              className: `${dropdownTableCell} ${tableCellExpand}`,
            }}
          ></T.Data>
          <T.Data
            box={{
              className: `${dropdownTableCell} ${tableCellFastNum}`,
            }}
          >
            <Checkbox
              id={unitCode}
              name={propertyUsageDescription}
              label={propertyUsageDescription}
              checked={checkedUnits ?? false}
              onChange={onCheckboxChange}
            />
          </T.Data>
          <T.Data
            box={{
              className: `${dropdownTableCell} ${tableCellMerking}`,
            }}
          >
            {unitCode ?? ''}
          </T.Data>
          <T.Data
            box={{
              className: `${dropdownTableCell} ${tableCellSize}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                className={`${input} ${sizeInput}`}
                type="number"
                name="propertySize"
                value={unitSizeValue}
                onChange={onUnitSizeChange}
                disabled={isUnitSizeDisabled}
              />
              <span>{sizeUnit}</span>
            </div>
          </T.Data>
          <T.Data
            box={{
              className: `${dropdownTableCell} ${tableCellNumOfRooms}`,
            }}
          >
            <input
              className={`${input} ${roomsInput}`}
              type="number"
              name="numOfRooms"
              value={numOfRoomsValue}
              onChange={onUnitRoomsChange}
              disabled={isNumOfRoomsDisabled}
            />
          </T.Data>
        </div>
      </T.Data>
    </tr>
  )
}
