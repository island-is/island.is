import React, { useContext, useMemo } from 'react'
import { Box, Text, Tag } from '@island.is/island-ui/core'

import * as styles from './DetentionRequests.treat'
import { mapCaseStateToTagVariant } from './utils'
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
import { insertAt } from '@island.is/judicial-system-web/src/utils/formatters'

interface Props {
  cases: Case[]
  onRowClick: (id: string) => void
}

const PastDetentionRequests: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props
  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const { user } = useContext(UserContext)
  const isCourtRole =
    user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

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
                {`kt. ${insertAt(
                  row.row.original.accusedNationalId.replace('-', ''),
                  '-',
                  6,
                )}`}
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
              <Box component="span" display="block">
                {row.row.original.type === CaseType.CUSTODY
                  ? 'Gæsluvarðhald'
                  : 'Farbann'}
              </Box>
              {row.row.original.parentCase && (
                <Text as="span" variant="small">
                  Framlenging
                </Text>
              )}
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
                  isCourtRole,
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
          row: {
            original: {
              rulingDate: string
              custodyEndDate: string
              courtEndTime: string
              state: CaseState
            }
          }
        }) => {
          const rulingDate = row.row.original.rulingDate
          const custodyEndDate = row.row.original.custodyEndDate
          const courtEndDate = row.row.original.courtEndTime
          const state = row.row.original.state

          if (state === CaseState.REJECTED) {
            return null
          } else if (rulingDate) {
            return `${formatDate(parseISO(rulingDate), 'd.M.y')} - ${formatDate(
              parseISO(custodyEndDate),
              'd.M.y',
            )}`
          } else if (courtEndDate) {
            return `${formatDate(
              parseISO(courtEndDate),
              'd.M.y',
            )} - ${formatDate(parseISO(custodyEndDate), 'd.M.y')}`
          } else {
            return formatDate(parseISO(custodyEndDate), 'd.M.y')
          }
        },
      },
    ],
    [isCourtRole],
  )

  const pastRequestsData = useMemo(() => cases, [cases])

  return (
    <Table
      columns={pastRequestsColumns}
      data={pastRequestsData || []}
      handleRowClick={onRowClick}
      className={styles.pastRequestsTable}
      sortableColumnIds={sortableColumnIds}
    />
  )
}

export default PastDetentionRequests
