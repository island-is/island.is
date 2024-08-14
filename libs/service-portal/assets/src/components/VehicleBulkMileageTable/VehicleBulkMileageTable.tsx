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

interface Props {
  row: Array<{
    id: string
    line: string[]
    detail: Array<string[]>
  }>
}

const VehicleBulkMileageTable = ({ row }: Props) => {
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
            { value: 'Ársnotkun' },
            { value: 'Kílómetrastaða' },
            { value: '', printHidden: true },
          ]}
        />
        <T.Body>
          {row.map((item) => (
            <ExpandRow
              key="Expand-row-id"
              data={[
                ...item.line.map((l) => {
                  return {
                    value: l,
                  }
                }),
                {
                  value: (
                    <Box className={styles.mwInput}>
                      <label className={helperStyles.srOnly} htmlFor={item.id}>
                        Kílómetrastaða
                      </label>
                      <Input
                        type="number"
                        id={item.id}
                        name={item.id}
                        size="xs"
                        rightAlign
                        maxLength={12}
                      />
                    </Box>
                  ),
                },
                {
                  value: (
                    <Button
                      icon="pencil"
                      size="small"
                      type="button"
                      variant="text"
                      onClick={() => alert(`Save data: ${item.id}`)}
                    >
                      Vista
                    </Button>
                  ),
                },
              ]}
            >
              <NestedFullTable
                headerArray={[
                  'Dagsetning',
                  'Skráning',
                  'Ársnotkun',
                  'Kílómetrastaða',
                ]}
                data={item.detail.map((det) => det)}
              />
            </ExpandRow>
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
