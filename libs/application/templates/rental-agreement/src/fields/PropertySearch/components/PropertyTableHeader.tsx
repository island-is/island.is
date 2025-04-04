import { Table as T } from '@island.is/island-ui/core'
import {
  tableHeadingCell,
  tableCellExpand,
  tableCellFastNum,
  tableCellMerking,
  tableCellSize,
  tableCellNumOfRooms,
} from '../propertySearch.css'
import { useLocale } from '@island.is/localization'
import { registerProperty } from '../../../lib/messages'

export const PropertyTableHeader = () => {
  const { formatMessage } = useLocale()
  return (
    <T.Head>
      <T.Row>
        <T.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellExpand}`,
          }}
        ></T.HeadData>
        <T.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellFastNum}`,
          }}
        >
          {formatMessage(registerProperty.search.searchResultHeaderPropertyId)}
        </T.HeadData>
        <T.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellMerking}`,
          }}
        >
          {formatMessage(registerProperty.search.searchResultHeaderMarking)}
        </T.HeadData>
        <T.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellSize}`,
          }}
        >
          {formatMessage(
            registerProperty.search.searchResultHeaderPropertySize,
          )}
        </T.HeadData>
        <T.HeadData
          box={{
            className: `${tableHeadingCell} ${tableCellNumOfRooms}`,
          }}
        >
          {formatMessage(registerProperty.search.searchResultsHeaderNumOfRooms)}
        </T.HeadData>
      </T.Row>
    </T.Head>
  )
}
