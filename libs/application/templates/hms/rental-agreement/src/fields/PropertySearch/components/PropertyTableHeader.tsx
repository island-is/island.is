import { Table } from '@island.is/island-ui/core'
import {
  tableHeadingCell,
  tableCellExpand,
  tableCellFastNum,
  tableCellMerking,
  tableCellSize,
  tableCellNumOfRooms,
} from '../propertySearch.css'
import { useLocale } from '@island.is/localization'
import * as m from '../../../lib/messages'

export const PropertyTableHeader = () => {
  const { formatMessage } = useLocale()
  return (
    <Table.Head>
      <Table.Row>
        <Table.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellExpand}`,
          }}
        ></Table.HeadData>
        <Table.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellFastNum}`,
          }}
        >
          {formatMessage(m.propertySearch.search.searchResultHeaderPropertyId)}
        </Table.HeadData>
        <Table.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellMerking}`,
          }}
        >
          {formatMessage(m.propertySearch.search.searchResultHeaderMarking)}
        </Table.HeadData>
        <Table.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellSize}`,
          }}
        >
          {formatMessage(m.misc.size)}
        </Table.HeadData>
        <Table.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellNumOfRooms}`,
          }}
        >
          {formatMessage(m.misc.rooms)}
        </Table.HeadData>
      </Table.Row>
    </Table.Head>
  )
}
