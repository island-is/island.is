import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  isDistrictCourtUser,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  CaseTag,
  getIndictmentCaseStateTag,
  TagAppealState,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { useContextMenu } from '../../ContextMenu/ContextMenu'
import WithdrawAppealContextMenuModal, {
  useWithdrawAppealMenuOption,
} from '../../ContextMenu/ContextMenuOptions/WithdrawAppealMenuOption'
import Table from '../Table'

interface Props {
  cases: CaseListEntry[]
}

const PastCasesTable: FC<Props> = ({ cases }) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const {
    withdrawAppealMenuOption,
    caseToWithdraw,
    setCaseToWithdraw,
    shouldDisplayWithdrawAppealOption,
  } = useWithdrawAppealMenuOption()

  const pastCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        (b['created'] ?? '').localeCompare(a['created'] ?? ''),
      ),
    [cases],
  )

  return (
    <>
      <Table
        thead={[
          {
            title: formatMessage(tables.caseNumber),
          },
          {
            title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
            sortable: { isSortable: true, key: 'defendants' },
          },
          {
            title: formatMessage(tables.type),
          },
          {
            title: capitalize(formatMessage(tables.created, { suffix: 'i' })),
            sortable: { isSortable: true, key: 'created' },
          },
          { title: formatMessage(tables.state) },
          { title: formatMessage(tables.duration) },
        ]}
        data={pastCasesData}
        generateContextMenuItems={(row) => [
          openCaseInNewTabMenuItem(row.id),
          ...(shouldDisplayWithdrawAppealOption(row)
            ? [withdrawAppealMenuOption(row.id)]
            : []),
        ]}
        columns={[
          {
            cell: (row) => (
              <CourtCaseNumber
                courtCaseNumber={row.courtCaseNumber}
                policeCaseNumbers={row.policeCaseNumbers}
                appealCaseNumber={row.appealCaseNumber}
              />
            ),
          },
          {
            cell: (row) => <DefendantInfo defendants={row.defendants} />,
          },
          {
            cell: (row) => (
              <ColumnCaseType
                type={row.type}
                decision={row.decision}
                parentCaseId={row.parentCaseId}
              />
            ),
          },
          {
            cell: (row) => <CreatedDate created={row.created} />,
          },
          {
            cell: (row) => {
              const indictmentCaseStateTag = getIndictmentCaseStateTag(
                row,
                user,
              )

              return (
                <>
                  <Box
                    marginRight={row.appealState ? 1 : 0}
                    marginBottom={row.appealState ? 1 : 0}
                  >
                    {isIndictmentCase(row.type) ? (
                      <CaseTag
                        color={indictmentCaseStateTag.color}
                        text={formatMessage(indictmentCaseStateTag.text)}
                      />
                    ) : (
                      <TagCaseState
                        caseState={row.state}
                        caseType={row.type}
                        isCourtRole={isDistrictCourtUser(user)}
                        isValidToDateInThePast={row.isValidToDateInThePast}
                        indictmentRulingDecision={row.indictmentRulingDecision}
                        indictmentDecision={row.indictmentDecision}
                      />
                    )}
                  </Box>
                  {row.appealState && (
                    <TagAppealState
                      appealState={row.appealState}
                      appealRulingDecision={row.appealRulingDecision}
                    />
                  )}
                </>
              )
            },
          },
          {
            cell: (row) => (
              <Text>
                {getDurationDate(
                  row.state,
                  row.validToDate,
                  row.initialRulingDate,
                  row.rulingDate,
                )}
              </Text>
            ),
          },
        ]}
      />
      {caseToWithdraw && (
        <WithdrawAppealContextMenuModal
          caseId={caseToWithdraw}
          cases={cases}
          onClose={() => setCaseToWithdraw(undefined)}
        />
      )}
    </>
  )
}

export default PastCasesTable
