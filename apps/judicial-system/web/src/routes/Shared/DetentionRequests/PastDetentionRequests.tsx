import React, { useContext, useMemo } from 'react'
import { Box, Text, Tag } from '@island.is/island-ui/core'

import * as styles from './DetentionRequests.treat'
import { openCase, mapCaseStateToTagVariant } from './utils'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import parseISO from 'date-fns/parseISO'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Table } from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  cases: Case[]
}

const PastDetentionRequests: React.FC<Props> = (props) => {
  const { cases } = props
  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const { user } = useContext(UserContext)
  const isJudge = user?.role === UserRole.JUDGE

  const pastRequestsColumns = useMemo(
    () => [
      {
        Header: 'Málsnr. ',
        accessor: 'courtCaseNumber' as keyof Case,
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string; policeCaseNumber: string }
          }
        }) => {
          return (
            <>
              <Box component="span" display="block">
                {row.row.original.courtCaseNumber}
              </Box>
              <Text as="span" variant="small">
                {row.row.original.policeCaseNumber}
              </Text>
            </>
          )
        },
      },
      {
        Header: 'Sakborningur',
        accessor: 'accusedName' as keyof Case,
        Cell: (row: {
          row: { original: { accusedName: string; accusedNationalId: string } }
        }) => {
          return (
            <>
              <Box component="span" display="block">
                {row.row.original.accusedName}
              </Box>
              <Text as="span" variant="small">
                {`kt. ${row.row.original.accusedNationalId}`}
              </Text>
            </>
          )
        },
      },
      {
        Header: 'Tegund',
        accessor: 'type' as keyof Case,
        Cell: (row: {
          row: { original: { type: CaseType; parentCase: Case } }
        }) => {
          return (
            <>
              {row.row.original.type === CaseType.CUSTODY
                ? 'Gæsluvarðhald'
                : 'Farbann'}
              {row.row.original.parentCase && <p>framlenging</p>}
            </>
          )
        },
      },
      {
        Header: 'Staða',
        accessor: 'state' as keyof Case,
        disableSortBy: true,
        Cell: (row: {
          row: {
            original: { state: CaseState; isCustodyEndDateInThePast: boolean }
          }
        }) => {
          return (
            <Tag outlined disabled>
              {
                mapCaseStateToTagVariant(
                  row.row.original.state,
                  isJudge,
                  row.row.original.isCustodyEndDateInThePast,
                ).text
              }
            </Tag>
          )
        },
      },
      {
        Header: 'Gildistími',
        accessor: 'rulingDate' as keyof Case,
        disableSortBy: true,
        Cell: (row: {
          row: { original: { rulingDate: string; custodyEndDate: string } }
        }) => {
          return `${formatDate(
            parseISO(row.row.original.rulingDate),
            'd.M.y',
          )} - ${formatDate(
            parseISO(row.row.original.custodyEndDate),
            'd.M.y',
          )}`
        },
      },
    ],
    [isJudge],
  )

  const pastRequestsData = useMemo(() => cases, [cases])

  return (
    <Table
      columns={pastRequestsColumns}
      data={pastRequestsData || []}
      handleRowClick={openCase}
      className={styles.pastRequestsTable}
      sortableColumnIds={sortableColumnIds}
    />
  )
}

export default PastDetentionRequests
