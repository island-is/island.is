import { MouseEventHandler } from 'react'
import { Table } from '@island.is/island-ui/core'

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
import { AppraisalUnit } from '@island.is/api/schema'
interface PropertyTableRowProps {
  appraisalUnits: Array<AppraisalUnit>
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
    <Table.Row>
      <Table.Data
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
      </Table.Data>
      <Table.Data
        box={{
          className: `${tableCell} ${tableCellFastNum}`,
        }}
      >
        {propertyCode}
      </Table.Data>
      <Table.Data
        box={{
          className: `${tableCell} ${tableCellMerking}`,
        }}
      >
        {unitCode}
      </Table.Data>
      <Table.Data
        box={{
          className: `${tableCell} ${tableCellSize}`,
        }}
      >
        {`${size} ${sizeUnit}`}
      </Table.Data>
      <Table.Data
        box={{
          className: `${tableCell} ${tableCellNumOfRooms}`,
        }}
      ></Table.Data>
    </Table.Row>
  )
}
