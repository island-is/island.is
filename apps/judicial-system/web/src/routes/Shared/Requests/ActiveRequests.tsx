import React, { useContext, useState } from 'react'
import cn from 'classnames'
import { Box, Text, Tag, Icon, Button } from '@island.is/island-ui/core'

import * as styles from './Requests.treat'
import { mapCaseStateToTagVariant } from './utils'
import { Case, CaseState, UserRole } from '@island.is/judicial-system/types'
import { insertAt } from '@island.is/judicial-system-web/src/utils/formatters'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import localeIS from 'date-fns/locale/is'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'

interface Props {
  cases: Case[]
  onRowClick: (id: string) => void
  onDeleteCase?: (caseToDelete: Case) => Promise<void>
}

type SortOption = 'up' | 'down' | 'default'

const ActiveRequests: React.FC<Props> = (props) => {
  const { cases, onRowClick, onDeleteCase } = props

  const { user } = useContext(UserContext)
  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isCourtRole =
    user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

  const [currentSort, setCurrentSort] = useState<SortOption>('default')
  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  const sortTypes = {
    accused: {
      up: {
        fn: (a: Case, b: Case) =>
          (a.accused[0].name || '') < (b.accused[0].name || '') ? -1 : 1,
      },
      down: {
        fn: (a: Case, b: Case) =>
          (a.accused[0].name || '') > (b.accused[0].name || '') ? -1 : 1,
      },
      default: {
        fn: (a: Case, b: Case) =>
          (a.accused[0].name || '') < (b.accused[0].name || '') ? -1 : 1,
      },
    },
  }

  const onSortChange = () => {
    let nextSort: SortOption = 'default'

    if (currentSort === 'down') nextSort = 'up'
    else if (currentSort === 'up') nextSort = 'default'
    else if (currentSort === 'default') nextSort = 'down'

    setCurrentSort(nextSort)
  }

  return (
    <table
      className={styles.activeRequestsTable}
      data-testid="custody-request-table"
      aria-describedby="activeRequestsTableCaption"
    >
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              Málsnr.
            </Text>
          </th>
          <th className={cn(styles.th, styles.largeColumn)}>
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={onSortChange}
              data-testid="accusedNameSortButton"
            >
              <Text fontWeight="regular">Sakborningur</Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortAccusedNameAsc]: currentSort === 'up',
                  [styles.sortAccusedNameDes]: currentSort === 'down',
                  [styles.sortAccusedNameDefault]: currentSort === 'default',
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
              Tegund
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              Staða
            </Text>
          </th>
          <th className={styles.th}>
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              // onClick={() => requestSort('created')}
            >
              <Text fontWeight="regular">Krafa stofnuð</Text>
              <Box
                // className={cn(styles.sortIcon, {
                //   [styles.sortCreatedAsc]:
                //     getClassNamesFor('created') === 'ascending',
                //   [styles.sortCreatedDes]:
                //     getClassNamesFor('created') === 'descending',
                // })}
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
      <tbody>
        {[...cases].sort(sortTypes.accused[currentSort].fn).map((c, i) => (
          <tr
            key={i}
            className={cn(
              styles.tableRowContainer,
              requestToRemoveIndex === i && 'isDeleting',
            )}
            data-testid="custody-requests-table-row"
            role="button"
            aria-label="Opna kröfu"
            onClick={() => {
              user?.role && onRowClick(c.id)
            }}
          >
            <td className={styles.td}>
              <Text as="span">{c.policeCaseNumber || '-'}</Text>
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <Text>
                <Box component="span" className={styles.accusedName}>
                  {c.accused[0].name || '-'}
                </Box>
              </Text>
              <Text>
                {c.accused[0].nationalId && (
                  <Text as="span" variant="small" color="dark400">
                    {`kt. ${
                      insertAt(
                        c.accused[0].nationalId.replace('-', ''),
                        '-',
                        6,
                      ) || '-'
                    }`}
                  </Text>
                )}
              </Text>
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
                    c.isValidToDateInThePast,
                  ).color
                }
                outlined
                disabled
              >
                {
                  mapCaseStateToTagVariant(
                    c.state,
                    isCourtRole,
                    c.isValidToDateInThePast,
                  ).text
                }
              </Tag>
            </td>
            <td className={styles.td}>
              <Text as="span">
                {format(parseISO(c.created), 'd.M.y', {
                  locale: localeIS,
                })}
              </Text>
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
                    onClick={(evt) => {
                      evt.stopPropagation()
                      setRequestToRemoveIndex(
                        requestToRemoveIndex === i ? undefined : i,
                      )
                    }}
                  >
                    <Icon icon="close" color="blue400" />
                  </Box>
                )}
            </td>
            <td
              className={cn(
                styles.deleteButtonContainer,
                styles.td,
                requestToRemoveIndex === i && 'open',
              )}
            >
              <Button
                colorScheme="destructive"
                size="small"
                onClick={(evt) => {
                  evt.stopPropagation()
                  setRequestToRemoveIndex(undefined)
                  onDeleteCase && onDeleteCase(cases[i])
                }}
              >
                <Box as="span" className={styles.deleteButtonText}>
                  Afturkalla
                </Box>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActiveRequests
