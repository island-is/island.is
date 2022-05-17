import React, { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import localeIS from 'date-fns/locale/is'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  useAnimation,
} from 'framer-motion'

import { Box, Text, Tag, Icon, Button } from '@island.is/island-ui/core'
import {
  CaseState,
  isInvestigationCase,
  UserRole,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  directionType,
  sortableTableColumn,
  SortConfig,
} from '@island.is/judicial-system-web/src/types'
import {
  capitalize,
  caseTypes,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { core, requests } from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'

import { mapCaseStateToTagVariant } from './utils'
import * as styles from './Cases.css'

interface Props {
  cases: Case[]
  onRowClick: (id: string) => void
  isDeletingCase: boolean
  onDeleteCase?: (caseToDelete: Case) => Promise<void>
  setActiveCases?: React.Dispatch<React.SetStateAction<Case[] | undefined>>
}

const ActiveCases: React.FC<Props> = (props) => {
  const {
    cases,
    onRowClick,
    isDeletingCase,
    onDeleteCase,
    setActiveCases,
  } = props

  const controls = useAnimation()

  const variants = {
    isDeleting: (custom: number) =>
      custom === requestToRemoveIndex ? { x: '-150px' } : { x: '0px' },
    isNotDeleting: { x: 0 },
    deleted: { opacity: 0, scale: 0.8 },
  }

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isCourtRole =
    user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'createdAt',
    direction: 'descending',
  })

  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  useMemo(() => {
    if (cases && sortConfig) {
      cases.sort((a: Case, b: Case) => {
        // Credit: https://stackoverflow.com/a/51169
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

  return (
    <table className={styles.table} data-testid="activeCasesTable">
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(
                requests.sections.activeRequests.table.headers.caseNumber,
              )}
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
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(
                requests.sections.activeRequests.table.headers.type,
              )}
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(
                requests.sections.activeRequests.table.headers.state,
              )}
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
                {formatMessage(
                  requests.sections.activeRequests.table.headers.date,
                )}
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
          <th></th>
        </tr>
      </thead>
      <AnimateSharedLayout>
        <tbody>
          <AnimatePresence>
            {cases.map((c, i) => (
              <motion.tr
                key={c.id}
                animate={controls}
                exit="deleted"
                variants={variants}
                custom={i}
                className={cn(styles.tableRowContainer)}
                layout
                data-testid="custody-cases-table-row"
                role="button"
                aria-label="Opna kröfu"
                onClick={() => {
                  user?.role && onRowClick(c.id)
                }}
              >
                <td className={styles.td}>
                  {c.courtCaseNumber ? (
                    <>
                      <Box component="span" className={styles.blockColumn}>
                        <Text as="span">{c.courtCaseNumber}</Text>
                      </Box>
                      <Text as="span" variant="small" color="dark400">
                        {c.policeCaseNumber}
                      </Text>
                    </>
                  ) : (
                    <Text as="span">{c.policeCaseNumber || '-'}</Text>
                  )}
                </td>
                <td className={cn(styles.td, styles.largeColumn)}>
                  {c.defendants && c.defendants.length > 0 ? (
                    <>
                      <Text>
                        <Box component="span" className={styles.blockColumn}>
                          {c.defendants[0].name ?? '-'}
                        </Box>
                      </Text>
                      {c.defendants.length === 1 ? (
                        (!c.defendants[0].noNationalId ||
                          c.defendants[0].nationalId) && (
                          <Text>
                            <Text as="span" variant="small" color="dark400">
                              {`${
                                c.defendants[0].noNationalId ? 'fd.' : 'kt.'
                              } ${
                                c.defendants[0].nationalId
                                  ? c.defendants[0].noNationalId
                                    ? c.defendants[0].nationalId
                                    : formatNationalId(
                                        c.defendants[0].nationalId,
                                      )
                                  : '-'
                              }`}
                            </Text>
                          </Text>
                        )
                      ) : (
                        <Text as="span" variant="small" color="dark400">
                          {`+ ${c.defendants.length - 1}`}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text>-</Text>
                  )}
                </td>
                <td className={styles.td}>
                  <Box component="span" display="flex" flexDirection="column">
                    <Text as="span">{capitalize(caseTypes[c.type])}</Text>
                    {c.parentCase && (
                      <Text as="span" variant="small" color="dark400">
                        Framlenging
                      </Text>
                    )}
                  </Box>
                </td>
                <td className={styles.td} data-testid="tdTag">
                  <Tag
                    variant={
                      mapCaseStateToTagVariant(
                        c.state,
                        isCourtRole,
                        isInvestigationCase(c.type),
                        c.isValidToDateInThePast,
                        c.courtDate,
                      ).color
                    }
                    outlined
                    disabled
                  >
                    {
                      mapCaseStateToTagVariant(
                        c.state,
                        isCourtRole,
                        isInvestigationCase(c.type),
                        c.isValidToDateInThePast,
                        c.courtDate,
                      ).text
                    }
                  </Tag>
                </td>
                <td className={styles.td}>
                  {c.courtDate ? (
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
                  ) : (
                    <Text as="span">
                      {format(parseISO(c.created), 'd.M.y', {
                        locale: localeIS,
                      })}
                    </Text>
                  )}
                </td>
                <td className={cn(styles.td, 'secondLast')}>
                  {isProsecutor &&
                    (c.state === CaseState.NEW ||
                      c.state === CaseState.DRAFT ||
                      c.state === CaseState.SUBMITTED ||
                      c.state === CaseState.RECEIVED) && (
                      <Box
                        data-testid="deleteCase"
                        component="button"
                        aria-label="Viltu afturkalla kröfu?"
                        className={styles.deleteButton}
                        onClick={async (evt) => {
                          evt.stopPropagation()

                          await new Promise((resolve) => {
                            setRequestToRemoveIndex(
                              requestToRemoveIndex === i ? undefined : i,
                            )

                            resolve(true)
                          })

                          await controls.start('isDeleting')
                        }}
                      >
                        <Icon icon="close" color="blue400" />
                      </Box>
                    )}
                </td>
                <td className={cn(styles.deleteButtonContainer, styles.td)}>
                  <Button
                    colorScheme="destructive"
                    size="small"
                    loading={isDeletingCase}
                    onClick={async (evt) => {
                      if (onDeleteCase && setActiveCases) {
                        evt.stopPropagation()

                        await onDeleteCase(cases[i])

                        controls
                          .start('isNotDeleting')
                          .then(() => {
                            setRequestToRemoveIndex(undefined)
                          })
                          .then(() => {
                            setActiveCases(
                              cases.filter((c: Case) => c !== cases[i]),
                            )
                          })
                      }
                    }}
                  >
                    <Box as="span" className={styles.deleteButtonText}>
                      Afturkalla
                    </Box>
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </AnimateSharedLayout>
    </table>
  )
}

export default ActiveCases
