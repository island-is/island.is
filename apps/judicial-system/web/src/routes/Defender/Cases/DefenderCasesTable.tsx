import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import router from 'next/router'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import localeIS from 'date-fns/locale/is'

import { Box, Checkbox, Icon, Text } from '@island.is/island-ui/core'

import {
  directionType,
  sortableTableColumn,
  SortConfig,
  TempCaseListEntry as CaseListEntry,
} from '@island.is/judicial-system-web/src/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'

import { CaseAppealState } from '@island.is/judicial-system-web/src/graphql/schema'
import TagAppealState from '@island.is/judicial-system-web/src/components/TagAppealState/TagAppealState'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import DefendantInfo from '@island.is/judicial-system-web/src/components/Table/DefendantInfo/DefendantInfo'
import CourtCaseNumber from '@island.is/judicial-system-web/src/components/Table/CourtCaseNumber/CourtCaseNumber'
import { CaseType, isIndictmentCase } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import * as styles from './DefenderCasesTable.css'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
}

export const DefenderCasesTable: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { cases, showingCompletedCases } = props

  const handleRowClick = (id: string, type: CaseType) => {
    isIndictmentCase(type)
      ? router.push(`${constants.DEFENDER_INDICTMENT_ROUTE}/${id}`)
      : router.push(`${constants.DEFENDER_ROUTE}/${id}`)
  }

  const [filteredCases, setFilteredCases] = useState<CaseListEntry[]>(cases)
  const [showIndictmentCases, setShowIndictmentCases] = useState<boolean>(true)
  const [showInvestigationCases, setShowInvestigationCases] = useState<boolean>(
    true,
  )

  const getFilteredCases = useCallback(() => {
    if (showIndictmentCases && showInvestigationCases) {
      return cases
    } else if (showIndictmentCases) {
      return cases.filter((theCase) => isIndictmentCase(theCase.type))
    } else if (showInvestigationCases) {
      return cases.filter((theCase) => !isIndictmentCase(theCase.type))
    } else {
      return []
    }
  }, [cases, showIndictmentCases, showInvestigationCases])

  useEffect(() => {
    const filteredCases = getFilteredCases()
    setFilteredCases(filteredCases)
  }, [cases, getFilteredCases])

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'createdAt',
    direction: 'descending',
  })

  const requestSort = (column: sortableTableColumn) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.column === column &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ column, direction: d })
  }

  const getClassNamesFor = (name: sortableTableColumn) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === name ? sortConfig.direction : undefined
  }

  useMemo(() => {
    cases.sort((a: CaseListEntry, b: CaseListEntry) => {
      const getColumnValue = (entry: CaseListEntry) => {
        if (
          sortConfig.column === 'defendant' &&
          entry.defendants &&
          entry.defendants.length > 0
        ) {
          return entry.defendants[0].name ?? ''
        }
        return entry['created']
      }

      const compareResult = getColumnValue(a).localeCompare(getColumnValue(b))

      return sortConfig.direction === 'ascending'
        ? compareResult
        : -compareResult
    })
  }, [cases, sortConfig])

  return (
    <Box marginBottom={7}>
      <Box marginTop={2} className={styles.gridRow}>
        <Checkbox
          label={formatMessage(tables.filterIndictmentCaseLabel)}
          checked={showIndictmentCases}
          onChange={() => setShowIndictmentCases(!showIndictmentCases)}
        ></Checkbox>
        <Checkbox
          label={formatMessage(tables.filterInvestigationCaseLabel)}
          checked={showInvestigationCases}
          onChange={() => setShowInvestigationCases(!showInvestigationCases)}
        ></Checkbox>
      </Box>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>
              <Text as="span" fontWeight="regular">
                {formatMessage(tables.caseNumber)}
              </Text>
            </th>
            <th className={styles.th}>
              <Box
                component="button"
                display="flex"
                alignItems="center"
                className={styles.thButton}
                onClick={() => requestSort('createdAt')}
              >
                <Text fontWeight="regular">
                  {formatMessage(tables.created)}
                </Text>
                <Box
                  className={cn(styles.sortIcon, {
                    [styles.sortCreatedAsc]:
                      getClassNamesFor('createdAt') === 'ascending',
                    [styles.sortCreatedDes]:
                      getClassNamesFor('createdAt') === 'descending',
                  })}
                  marginLeft={1}
                  component="span"
                  display="flex"
                  alignItems="center"
                >
                  <Icon icon="caretUp" size="small" />
                </Box>
              </Box>
            </th>
            <th className={styles.th}>
              <Text as="span" fontWeight="regular">
                {formatMessage(tables.type)}
              </Text>
            </th>
            <th className={cn(styles.th, styles.largeColumn)}>
              <Box
                component="button"
                display="flex"
                alignItems="center"
                className={styles.thButton}
                onClick={() => requestSort('defendant')}
                data-testid="accusedNameSortButton"
              >
                <Text fontWeight="regular">
                  {capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
                </Text>
                <Box
                  className={cn(styles.sortIcon, {
                    [styles.sortAccusedNameAsc]:
                      getClassNamesFor('defendant') === 'ascending',
                    [styles.sortAccusedNameDes]:
                      getClassNamesFor('defendant') === 'descending',
                  })}
                  marginLeft={1}
                  component="span"
                  display="flex"
                  alignItems="center"
                >
                  <Icon icon="caretDown" size="small" />
                </Box>
              </Box>
            </th>
            <th className={cn(styles.th, styles.largeColumn)}>
              <Text as="span" fontWeight="regular">
                {formatMessage(tables.state)}
              </Text>
            </th>
            {showingCompletedCases ? (
              <th>
                <Text fontWeight="regular">
                  {formatMessage(tables.duration)}
                </Text>
              </th>
            ) : (
              <th>
                <Text fontWeight="regular">
                  {formatMessage(tables.hearingArrangementDate)}
                </Text>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredCases?.map((c: CaseListEntry) => (
            <tr
              className={cn(styles.tableRowContainer)}
              key={c.id}
              onClick={() => handleRowClick(c.id, c.type)}
            >
              <td className={styles.td}>
                <CourtCaseNumber
                  courtCaseNumber={c.courtCaseNumber}
                  policeCaseNumbers={c.policeCaseNumbers}
                />
              </td>
              <td className={cn(styles.td)}>
                <Text as="span">
                  {format(parseISO(c.created), 'd.M.y', {
                    locale: localeIS,
                  })}
                </Text>
              </td>
              <td className={styles.td}>
                <Text as="span">
                  {displayCaseType(formatMessage, c.type, c.decision)}
                </Text>
              </td>
              <td className={cn(styles.td)}>
                <DefendantInfo defendants={c.defendants} />
              </td>
              <td className={styles.td} data-testid="tdTag">
                <Box marginRight={1} marginBottom={1}>
                  <TagCaseState
                    caseState={c.state}
                    caseType={c.type}
                    isValidToDateInThePast={c.isValidToDateInThePast}
                    courtDate={c.courtDate}
                  />
                </Box>
                {c.appealState && (
                  <TagAppealState
                    appealState={c.appealState}
                    appealRulingDecision={c.appealRulingDecision}
                  />
                )}
              </td>
              {showingCompletedCases ? (
                <td className={styles.td}>
                  <Text>
                    {c.validToDate &&
                      c.courtEndTime &&
                      `${formatDate(c.courtEndTime, 'd.M.y')} - ${formatDate(
                        c.validToDate,
                        'd.M.y',
                      )}`}
                  </Text>
                </td>
              ) : (
                <td className={styles.td}>
                  {c.courtDate && (
                    <>
                      <Text>
                        <Box component="span" className={styles.blockColumn}>
                          {capitalize(
                            format(parseISO(c.courtDate), 'EEEE d. LLLL y', {
                              locale: localeIS,
                            }),
                          ).replace('dagur', 'd.')}
                        </Box>
                      </Text>
                      <Text as="span" variant="small">
                        kl. {format(parseISO(c.courtDate), 'kk:mm')}
                      </Text>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default DefenderCasesTable
