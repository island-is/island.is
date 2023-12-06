import React, { useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableBody,
  LoadingContainer,
  TableSkeleton,
  TextTableItem,
  usePseudoName,
  State,
  SortableTableHeader,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationHeaderSortByEnum,
  ApplicationState,
  getMonth,
  getStateUrlFromRoute,
  Routes,
  SortableTableHeaderProps,
} from '@island.is/financial-aid/shared/lib'

import { useAllApplications } from '@island.is/financial-aid-web/veita/src/utils/useAllApplications'
import { calcDifferenceInDate } from '@island.is/financial-aid-web/veita/src/utils/formHelper'
import useSortedApplications from '@island.is/financial-aid-web/veita/src/utils/useSortedApplications'

interface PageProps {
  applications: Application[]
  setApplications?: React.Dispatch<
    React.SetStateAction<Application[] | undefined>
  >
  headers: SortableTableHeaderProps[]
  defaultHeaderSort: ApplicationHeaderSortByEnum
  emptyText?: string
}

const ApplicationsTable = ({
  applications,
  headers,
  emptyText,
  setApplications,
  defaultHeaderSort,
}: PageProps) => {
  const router = useRouter()

  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortedApplications(defaultHeaderSort, 'descending', applications)

  const changeApplicationTable = useAllApplications()

  const [isLoading, setIsLoading] = useState(false)

  const updateApplicationAndTable = async (
    applicationId: string,
    state: ApplicationState,
  ) => {
    setIsLoading(true)
    await changeApplicationTable(
      applicationId,
      state,
      getStateUrlFromRoute[router.pathname],
    )
      .then((updateTable) => {
        setIsLoading(false)
        setApplications && setApplications(updateTable)
      })
      .catch(() => {
        //TODO ERROR STATE
        setIsLoading(false)
      })
  }

  const assignButton = (application: Application) => {
    return (
      <>
        {application.staff?.name ? (
          <Box className={tableStyles.rowContent}>
            <Text>{application.staff?.name}</Text>
          </Box>
        ) : (
          <Box>
            <Button
              variant="text"
              onClick={(ev) => {
                ev.stopPropagation()
                updateApplicationAndTable(
                  application.id,
                  ApplicationState.INPROGRESS,
                )
              }}
            >
              Sjá um
            </Button>
          </Box>
        )}
      </>
    )
  }

  if (applications && applications.length > 0) {
    return (
      <LoadingContainer isLoading={isLoading} loader={<TableSkeleton />}>
        <div className={`${tableStyles.wrapper} hideScrollBar`}>
          <div className={tableStyles.bigTableWrapper}>
            <table
              className={cn({
                [`${tableStyles.tableContainer}`]: true,
              })}
              key={router.pathname}
            >
              <thead className={`contentUp delay-50`}>
                <tr>
                  {headers.map((header, index) => (
                    <SortableTableHeader
                      key={`table-header-${index}`}
                      index={index}
                      header={header}
                      sortAsc={getClassNamesFor(header.sortBy) === 'ascending'}
                      isSortActive={isActiveColumn(header.sortBy)}
                      onClick={() => requestSort(header.sortBy)}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {sortedData.map((item: Application, index) => (
                  <TableBody
                    items={[
                      usePseudoName(item.nationalId, item.name),
                      State(item.state),
                      TextTableItem(
                        'default',
                        calcDifferenceInDate(item.modified),
                      ),
                      TextTableItem(
                        'default',
                        getMonth(new Date(item.created).getMonth()),
                      ),
                      assignButton(item),
                    ]}
                    identifier={item.id}
                    index={index}
                    key={item.id}
                    onClick={() =>
                      router.push(Routes.applicationProfile(item.id))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LoadingContainer>
    )
  }

  return (
    <Text marginTop={2}>
      {emptyText ?? 'Engar umsóknir bíða þín, vel gert 👏'}
    </Text>
  )
}

export default ApplicationsTable
