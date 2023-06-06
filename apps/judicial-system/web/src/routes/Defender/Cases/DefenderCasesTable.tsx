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
import TagAppealRuling from '@island.is/judicial-system-web/src/components/TagAppealRuling/TagAppealRuling'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import DefendantInfo from '@island.is/judicial-system-web/src/components/Table/DefendantInfo/DefendantInfo'
import CourtCaseNumber from '@island.is/judicial-system-web/src/components/Table/CourtCaseNumber/CourtCaseNumber'
import { CaseType, isIndictmentCase } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import * as styles from './DefenderCasesTable.css'

interface Props {
  cases: CaseListEntry[]
}

export const DefenderCasesTable: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { cases } = props

  const handleRowClick = (id: string, type: CaseType) => {
    isIndictmentCase(type)
      ? router.push(`${constants.DEFENDER_INDICTMENT_ROUTE}/${id}`)
      : router.push(`${constants.DEFENDER_ROUTE}/${id}`)
  }

  const [filteredCases, setFilteredCases] = useState<CaseListEntry[]>(cases)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'createdAt',
    direction: 'descending',
  })

  const [indictmentCheckbox, setIndictmentCheckbox] = useState<boolean>(true)
  const [investigationCheckbox, setInvestigationCheckbox] = useState<boolean>(
    true,
  )

  const getFilteredCases = useCallback(() => {
    if (indictmentCheckbox && investigationCheckbox) {
      return cases
    } else if (indictmentCheckbox) {
      return cases.filter((theCase) => isIndictmentCase(theCase.type))
    } else if (investigationCheckbox) {
      return cases.filter((theCase) => !isIndictmentCase(theCase.type))
    } else {
      return []
    }
  }, [cases, indictmentCheckbox, investigationCheckbox])

  useEffect(() => {
    const filteredCases = getFilteredCases()
    setFilteredCases(filteredCases)
  }, [cases, getFilteredCases])

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
    if (cases && sortConfig) {
      cases.sort((a: CaseListEntry, b: CaseListEntry) => {
        return sortConfig.direction === 'ascending'
          ? (sortConfig.column === 'defendant' &&
            a.defendants &&
            a.defendants.length > 0
              ? a.defendants[0].name ?? ''
              : b['courtDate'] + a['created']
            ).localeCompare(
              sortConfig.column === 'defendant' &&
                b.defendants &&
                b.defendants.length > 0
                ? b.defendants[0].name ?? ''
                : a['courtDate'] + b['created'],
            )
          : (sortConfig.column === 'defendant' &&
            b.defendants &&
            b.defendants.length > 0
              ? b.defendants[0].name ?? ''
              : a['courtDate'] + b['created']
            ).localeCompare(
              sortConfig.column === 'defendant' &&
                a.defendants &&
                a.defendants.length > 0
                ? a.defendants[0].name ?? ''
                : b['courtDate'] + a['created'],
            )
      })
    }
  }, [cases, sortConfig])

  return (
    <Box marginBottom={7}>
      <Box marginTop={2} className={styles.gridRow}>
        <Checkbox
          label={formatMessage(tables.filterIndicmentCaseLabel)}
          checked={indictmentCheckbox}
          onChange={() => setIndictmentCheckbox(!indictmentCheckbox)}
        ></Checkbox>
        <Checkbox
          label={formatMessage(tables.filterInvestigationCaseLabel)}
          checked={investigationCheckbox}
          onChange={() => setInvestigationCheckbox(!investigationCheckbox)}
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
            <th>
              <Box
                component="button"
                display="flex"
                alignItems="center"
                className={styles.thButton}
                onClick={() => requestSort('duration')}
              >
                <Text fontWeight="regular">
                  {formatMessage(tables.duration)}
                </Text>
                <Box
                  className={cn(styles.sortIcon, {
                    [styles.sortDurationAsc]:
                      getClassNamesFor('duration') === 'ascending',
                    [styles.sortDurationDes]:
                      getClassNamesFor('duration') === 'descending',
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

                {c.appealState === CaseAppealState.COMPLETED && (
                  <TagAppealRuling
                    appealRulingDecision={c.appealRulingDecision}
                  />
                )}
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default DefenderCasesTable
