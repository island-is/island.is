import { MouseEventHandler } from 'react'
import { Table as T } from '@island.is/island-ui/core'
import { AppraisalUnit } from '@island.is/api/schema'
import {
  tableCell,
  tableCellExpand,
  tableCellFastNum,
  tableCellMerking,
  tableCellSize,
  tableCellNumOfRooms,
} from '../propertySearch.css'
import IconCircleClose from '../../../assets/IconCircleClose'
import IconCircleOpen from '../../../assets/IconCircleOpen'

interface PropertyTableRowProps {
  appraisalUnits: AppraisalUnit[]
  propertyCode?: number
  unitCode?: string
  size?: number
  sizeUnit?: string
  isTableExpanded: boolean
  toggleExpand: MouseEventHandler<HTMLButtonElement> | undefined
}

export const PropertyTableRow = ({
  appraisalUnits,
  propertyCode,
  unitCode,
  size,
  sizeUnit,
  isTableExpanded,
  toggleExpand,
}: PropertyTableRowProps) => {
  return (
    <T.Row>
      <T.Data
        box={{
          className: `${tableCell} ${tableCellExpand}`,
        }}
      >
        {appraisalUnits && appraisalUnits.length > 0 && (
          <button onClick={toggleExpand}>
            {propertyCode && isTableExpanded ? (
              <IconCircleClose />
            ) : (
              <IconCircleOpen />
            )}
          </button>
        )}
      </T.Data>
      <T.Data
        box={{
          className: `${tableCell} ${tableCellFastNum}`,
        }}
      >
        {propertyCode}
      </T.Data>
      <T.Data
        box={{
          className: `${tableCell} ${tableCellMerking}`,
        }}
      >
        {unitCode}
      </T.Data>
      <T.Data
        box={{
          className: `${tableCell} ${tableCellSize}`,
        }}
      >
        {`${size} ${sizeUnit}`}
      </T.Data>
      <T.Data
        box={{
          className: `${tableCell} ${tableCellNumOfRooms}`,
        }}
      ></T.Data>
    </T.Row>
  )
}
