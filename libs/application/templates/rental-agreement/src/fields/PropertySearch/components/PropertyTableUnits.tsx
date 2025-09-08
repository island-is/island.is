import { Checkbox, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  hiddenTableRow,
  hiddenTableRowExpanded,
  tableCellExpand,
  dropdownTableCell,
  tableCellMerking,
  tableCellSize,
  tableCellNumOfRooms,
  input,
  inputError,
  sizeInput,
  tableCellFastNum,
  noInputArrows,
} from '../propertySearch.css'
import * as m from '../../../lib/messages'

const isValidInteger = (value: string): boolean => {
  return /^\d*$/.test(value)
}

const isValidDecimal = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value)
}
interface PropertyUnitsProps {
  unitCode?: string
  propertyUsageDescription?: string
  sizeUnit?: string
  checkedUnits: boolean
  isTableExpanded: boolean
  unitSizeValue?: string | number
  numOfRoomsValue?: string | number
  isUnitSizeDisabled: boolean
  isNumOfRoomsDisabled: boolean
  unitInputErrorMessage?: string
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUnitSizeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUnitRoomsChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PropertyTableUnits = ({
  unitCode,
  propertyUsageDescription,
  sizeUnit,
  checkedUnits,
  isTableExpanded,
  unitSizeValue,
  numOfRoomsValue = 0,
  isUnitSizeDisabled,
  isNumOfRoomsDisabled,
  unitInputErrorMessage,
  onCheckboxChange,
  onUnitSizeChange,
  onUnitRoomsChange,
}: PropertyUnitsProps) => {
  const { formatMessage } = useLocale()
  // Prevent scrolling from changing the number input value
  const preventScrollChange = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur()
  }

  const sizeInputError =
    unitInputErrorMessage ===
      formatMessage(m.registerProperty.search.changedSizeTooLargeError) ||
    unitInputErrorMessage ===
      formatMessage(m.registerProperty.search.changedSizeTooSmallError)

  const roomsInputError =
    unitInputErrorMessage ===
      formatMessage(m.registerProperty.search.numOfRoomsMinimumError) ||
    unitInputErrorMessage ===
      formatMessage(m.registerProperty.search.numOfRoomsMaximumError)

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
          borderBottomWidth: isTableExpanded ? 'standard' : undefined,
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
                className={`${input} ${sizeInput} ${noInputArrows} ${
                  checkedUnits && sizeInputError ? inputError : ''
                }`}
                type="text"
                name="propertySize"
                min={0}
                step={0.1}
                value={Number(unitSizeValue)}
                onChange={(e) => {
                  if (isValidDecimal(e.target.value)) {
                    onUnitSizeChange?.(e)
                  }
                }}
                onWheel={preventScrollChange}
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
              className={`${input} ${noInputArrows} ${
                checkedUnits && roomsInputError ? inputError : ''
              }`}
              type="text"
              name="numOfRooms"
              min={0}
              value={Number(numOfRoomsValue)}
              onChange={(e) => {
                if (isValidInteger(e.target.value)) {
                  onUnitRoomsChange?.(e)
                }
              }}
              onWheel={preventScrollChange}
              disabled={isNumOfRoomsDisabled}
            />
          </T.Data>
        </div>
      </T.Data>
    </tr>
  )
}
