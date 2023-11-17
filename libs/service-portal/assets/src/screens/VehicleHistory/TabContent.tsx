import React, { FC, useEffect, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { VehicleUserTypeEnum } from '@island.is/api/schema'
import {
  Box,
  Text,
  Table as T,
  Pagination,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { vehicleMessage as messages } from '../../lib/messages'
import HistoryTableData from './HistoryTableData'
import HistoryTableHeader from './HistoryTableHeader'
import { useGetUsersVehiclesLazyQuery } from './VehicleHistory.generated'

interface Props {
  type: VehicleUserTypeEnum
  showDeregistered?: boolean
  fromDate?: Date | null
  toDate?: Date | null
}

export const TabContent: FC<React.PropsWithChildren<Props>> = ({
  type,
  showDeregistered = false,
  fromDate,
  toDate,
}) => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)

  const [
    GetUsersVehiclesLazyQuery,
    { loading, error, fetchMore, ...usersVehicleQuery },
  ] = useGetUsersVehiclesLazyQuery({
    variables: {
      input: {
        pageSize: 10,
        page: page,
        showDeregeristered: showDeregistered,
        showHistory: true,
        type,
        dateFrom: fromDate,
        dateTo: toDate,
      },
    },
  })

  useEffect(() => {
    GetUsersVehiclesLazyQuery()
  }, [page])

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

  if (
    !loading &&
    usersVehicleQuery.data?.vehiclesList?.vehicleList?.length === 0
  ) {
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
          {loading && (
            <T.Body>
              <T.Row>
                <T.Data colSpan={7}>
                  <SkeletonLoader space={1} height={40} repeat={5} />
                </T.Data>
              </T.Row>
            </T.Body>
          )}
          {usersVehicleQuery.data?.vehiclesList?.vehicleList?.map(
            (item, index) => {
              return (
                <HistoryTableData key={index} vehicle={item} locale={lang} />
              )
            },
          )}
        </T.Table>
      </Box>
      {!loading &&
        (usersVehicleQuery.data?.vehiclesList?.paging?.totalPages ?? 0) > 1 && (
          <Box marginTop={4}>
            <Pagination
              page={
                usersVehicleQuery.data?.vehiclesList?.paging?.pageNumber ?? 0
              }
              totalPages={
                usersVehicleQuery.data?.vehiclesList?.paging?.totalPages ?? 0
              }
              renderLink={(page, className, children) => (
                <button className={className} onClick={() => setPage(page)}>
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
