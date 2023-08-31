import React, { FC, useCallback, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { VehiclesVehicle } from '@island.is/api/schema'
import { Box, Text, Table as T, Pagination } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import HistoryTableData from './HistoryTableData'
import HistoryTableHeader from './HistoryTableHeader'

interface Props {
  data: VehiclesVehicle[]
}

export const TabContent: FC<React.PropsWithChildren<Props>> = ({ data }) => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)

  const pageSize = 15

  const handlePageChange = useCallback((page: number) => setPage(page), [])

  const headerLabels = [
    {
      value: formatMessage(messages.permno),
    },
    {
      value: formatMessage(messages.type),
    },
    {
      value: formatMessage(messages.firstReg),
    },
    {
      value: formatMessage(messages.baught),
    },
    {
      value: formatMessage(messages.sold),
    },
    {
      value: formatMessage(messages.innlogn),
    },
    {
      value: formatMessage(messages.status),
    },
  ]

  const pagedInfo = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(data.length / pageSize),
  }

  if (data.length === 0) {
    return (
      <Box width="full" marginTop={4} display="flex" justifyContent="center">
        <Text variant="h5" as="h3">
          {formatMessage(messages.noVehiclesFound)}
        </Text>
      </Box>
    )
  }
  return (
    <>
      <Box width="full" marginTop={4}>
        <T.Table>
          <HistoryTableHeader labels={headerLabels} />

          {data.slice(pagedInfo.from, pagedInfo.to).map((item, index) => {
            return <HistoryTableData key={index} vehicle={item} locale={lang} />
          })}
        </T.Table>
      </Box>
      {pagedInfo.totalPages > 1 && (
        <Box marginTop={4}>
          <Pagination
            page={page}
            totalPages={pagedInfo.totalPages}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={handlePageChange.bind(null, page)}
              >
                {children}
              </button>
            )}
          />
        </Box>
      )}
    </>
  )
}

export default TabContent
