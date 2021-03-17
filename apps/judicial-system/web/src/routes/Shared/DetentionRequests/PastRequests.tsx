import React from 'react'
import cn from 'classnames'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import localeIS from 'date-fns/locale/is'
import {
  Button,
  Text,
  Tag,
  Box,
  Icon,
  TagVariant,
} from '@island.is/island-ui/core'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { insertAt } from '@island.is/judicial-system-web/src/utils/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import { DetentionRequestTableProps } from '../../../types'
import * as styles from './DetentionRequests.treat'

const PastRequests: React.FC<DetentionRequestTableProps> = (props) => {
  const {
    requestSort,
    getClassNamesFor,
    cases,
    handleClick,
    mapCaseStateToTagVariant,
  } = props

  return (
    <table
      className={styles.pastRequestsTable}
      data-testid="detention-requests-table"
      aria-describedby="tableCation"
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
              onClick={() => requestSort('accusedName')}
            >
              <Text fontWeight="regular">Sakborningur</Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortAccusedNameAsc]:
                    getClassNamesFor('accusedName') === 'ascending',
                  [styles.sortAccusedNameDes]:
                    getClassNamesFor('accusedName') === 'descending',
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
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={() => requestSort('created')}
            >
              <Text fontWeight="regular">Krafa stofnuð</Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortCreatedAsc]:
                    getClassNamesFor('created') === 'ascending',
                  [styles.sortCreatedDes]:
                    getClassNamesFor('created') === 'descending',
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
              Tegund
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              Staða
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              Gildistími
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c, i) => (
          <tr
            key={i}
            className={styles.tableRowContainer}
            data-testid="detention-requests-table-row"
            role="button"
            aria-label="Opna kröfu"
            onClick={() => {
              handleClick(c)
            }}
          >
            <td className={styles.td}>
              <Text as="span">{c.policeCaseNumber || '-'}</Text>
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <Text>
                <Box component="span" className={styles.accusedName}>
                  {c.accusedName || '-'}
                </Box>
              </Text>
              <Text>
                {c.accusedNationalId && (
                  <Text as="span" variant="small" color="dark400">
                    {`kt: ${
                      insertAt(c.accusedNationalId.replace('-', ''), '-', 6) ||
                      '-'
                    }`}
                  </Text>
                )}
              </Text>
            </td>
            <td className={styles.td}>
              <Text as="span">
                {format(parseISO(c.created), 'd.M.y', {
                  locale: localeIS,
                })}
              </Text>
            </td>
            <td className={styles.td}>
              <Box component="span" display="flex" flexDirection="column">
                <Text as="span">
                  {c.type === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann'}
                </Text>
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
                  mapCaseStateToTagVariant(c.state, c.isCustodyEndDateInThePast)
                    .color
                }
                outlined
                disabled
              >
                {
                  mapCaseStateToTagVariant(c.state, c.isCustodyEndDateInThePast)
                    .text
                }
              </Tag>
            </td>
            <td className={styles.td}>
              <Text as="span">
                {c.custodyEndDate && c.state === CaseState.ACCEPTED
                  ? `${formatDate(c.custodyEndDate, 'd.M.y')}`
                  : null}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PastRequests
