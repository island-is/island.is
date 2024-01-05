import React, { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableBody,
  TextTableItem,
  usePseudoName,
  State,
  SortableTableHeader,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationHeaderSortByEnum,
  getMonth,
  Routes,
  SortableTableHeaderProps,
} from '@island.is/financial-aid/shared/lib'

import { calcDifferenceInDate } from '@island.is/financial-aid-web/veita/src/utils/formHelper'
import useSortedApplications from '@island.is/financial-aid-web/veita/src/utils/useSortedApplications'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface PageProps {
  applications: Application[]
  headers: SortableTableHeaderProps[]
  defaultHeaderSort: ApplicationHeaderSortByEnum
}

const ApplicationsFilterTable = ({
  applications,
  headers,
  defaultHeaderSort,
}: PageProps) => {
  const router = useRouter()
  const { admin } = useContext(AdminContext)

  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortedApplications(defaultHeaderSort, 'descending', applications)

  const staff = (staffName?: string) => (
    <Box className={tableStyles.rowContent}>
      {staffName && <Text>{staffName}</Text>}
    </Box>
  )

  return (
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
                  usePseudoName(
                    item.nationalId,
                    item.name,
                    admin?.staff?.usePseudoName,
                  ),
                  State(item.state),
                  TextTableItem('default', calcDifferenceInDate(item.modified)),
                  TextTableItem(
                    'default',
                    getMonth(new Date(item.created).getMonth()),
                  ),
                  staff(item.staff?.name),
                ]}
                identifier={item.id}
                index={index}
                key={item.id}
                onClick={() => router.push(Routes.applicationProfile(item.id))}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApplicationsFilterTable
