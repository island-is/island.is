import {
  Table as T,
  Box,
  Pagination,
  Button,
  Input,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  ExpandRow,
  ExpandHeader,
  NestedFullTable,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { helperStyles } from '@island.is/island-ui/theme'
import * as styles from './VehicleBulkMileageTable.css'
import { VehicleBulkMileageTableRow } from './VehicleBulkMileageTableRow'

interface Props {
  row: Array<{
    id: string
    line: string[]
    detail: Array<string[]>
  }>
  onRowSaveClick: (mileage: number, permNo: string) => void
}

const VehicleBulkMileageTable = ({ row, onRowSaveClick }: Props) => {
  const { formatMessage, lang } = useLocale()

  // const totalPages =
  //   payments.totalCount > itemsOnPage
  //     ? Math.ceil(payments.totalCount / itemsOnPage)
  //     : 0

  return (
    <Box>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: 'Tegund' },
            { value: 'Fastanúmer' },
            { value: 'Síðast skráð' },
            { value: 'Kílómetrastaða' },
            { value: '', printHidden: true },
          ]}
        />
        <T.Body>
          {row.map((item) => (
            <VehicleBulkMileageTableRow
              {...item}
              onSaveClick={onRowSaveClick}
            />
          ))}
        </T.Body>
      </T.Table>
      {/* {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(p, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(p)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null} */}
    </Box>
  )
}

export default VehicleBulkMileageTable
