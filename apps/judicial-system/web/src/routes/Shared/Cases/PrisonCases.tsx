import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'

import { AlertMessage, Box, Tag, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  TagAppealState,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import {
  CaseListEntry,
  CaseState,
  CaseType,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { usePrisonCasesQuery } from './prisonCases.generated'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const PrisonCases: FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const isPrisonAdmin = user?.institution?.type === InstitutionType.PRISON_ADMIN

  const { data, error, loading } = usePrisonCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const [activeCases, pastCases, indictmentCases] = useMemo(() => {
    if (!resCases) {
      return [[], [], []]
    }

    const [indictmentCases, otherCases] = partition(
      resCases,
      (c) => c.type === CaseType.INDICTMENT,
    )
    const [activeCases, pastCases] = partition(
      otherCases,
      (c) => !c.isValidToDateInThePast,
    )

    return [activeCases, pastCases, indictmentCases]
  }, [resCases])

  const renderTable = useMemo(
    () => (cases: CaseListEntry[]) => {
      return (
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
              title: capitalize(formatMessage(tables.created)),
              sortable: { isSortable: true, key: 'created' },
            },
            { title: formatMessage(tables.state) },
            {
              title: formatMessage(tables.duration),
            },
          ]}
          data={cases}
          columns={[
            {
              cell: (row) => (
                <CourtCaseNumber
                  courtCaseNumber={row.courtCaseNumber ?? ''}
                  policeCaseNumbers={row.policeCaseNumbers ?? []}
                  appealCaseNumber={row.appealCaseNumber ?? ''}
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
              cell: (row) => (
                <>
                  <Box
                    display="inlineBlock"
                    marginRight={row.appealState ? 1 : 0}
                    marginBottom={row.appealState ? 1 : 0}
                  >
                    <TagCaseState caseState={CaseState.ACCEPTED} />
                  </Box>
                  {row.appealState && (
                    <TagAppealState
                      appealState={row.appealState}
                      appealRulingDecision={row.appealRulingDecision}
                    />
                  )}
                </>
              ),
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
          generateContextMenuItems={(row) => [openCaseInNewTabMenuItem(row.id)]}
        />
      )
    },
    [formatMessage, openCaseInNewTabMenuItem],
  )

  const renderIndictmentTable = useMemo(
    () => (cases: CaseListEntry[]) => {
      return (
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
              title: formatMessage(tables.court),
            },
            {
              title: capitalize(formatMessage(tables.sentencingDate)),
            },
            { title: formatMessage(tables.state) },
          ]}
          data={cases}
          columns={[
            {
              cell: (row) => (
                <CourtCaseNumber
                  courtCaseNumber={row.courtCaseNumber ?? ''}
                  policeCaseNumbers={row.policeCaseNumbers ?? []}
                  appealCaseNumber={row.appealCaseNumber ?? ''}
                />
              ),
            },
            {
              cell: (row) => <DefendantInfo defendants={row.defendants} />,
            },
            {
              cell: (row) => <ColumnCaseType type={row.type} />,
            },
            {
              cell: (row) => (
                <CreatedDate created={row.indictmentCompletedDate} />
              ),
            },
            {
              cell: () => (
                <Tag variant="purple" outlined disabled truncate>
                  {'Nýtt'}
                </Tag>
              ),
            },
          ]}
          generateContextMenuItems={(row) => [openCaseInNewTabMenuItem(row.id)]}
        />
      )
    },
    [formatMessage, openCaseInNewTabMenuItem],
  )

  const renderAlertMessage = () => {
    return (
      <div className={styles.infoContainer}>
        <AlertMessage
          type="info"
          title={formatMessage(
            m.activeRequests.prisonStaffUsers.infoContainerTitle,
          )}
          message={formatMessage(
            m.activeRequests.prisonStaffUsers.infoContainerText,
          )}
        />
      </div>
    )
  }

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      {error ? (
        <div
          className={styles.infoContainer}
          data-testid="custody-requests-error"
        >
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : (
        <>
          {isPrisonAdmin && (
            <>
              <SectionHeading
                title={formatMessage(
                  m.activeRequests.prisonStaffUsers
                    .prisonAdminIndictmentCaseTitle,
                )}
              />
              <Box marginBottom={[5, 5, 12]}>
                {loading || !user || indictmentCases.length > 0
                  ? renderIndictmentTable(indictmentCases)
                  : renderAlertMessage()}
              </Box>
            </>
          )}

          <SectionHeading
            title={formatMessage(
              isPrisonAdmin
                ? m.activeRequests.prisonStaffUsers.prisonAdminTitle
                : m.activeRequests.prisonStaffUsers.title,
            )}
          />
          <Box marginBottom={[5, 5, 12]}>
            {loading || !user || activeCases.length > 0
              ? renderTable(activeCases)
              : renderAlertMessage()}
          </Box>

          <SectionHeading
            title={formatMessage(
              isPrisonAdmin
                ? m.pastRequests.prisonStaffUsers.prisonAdminTitle
                : m.pastRequests.prisonStaffUsers.title,
            )}
          />
          {loading || pastCases.length > 0
            ? renderTable(pastCases)
            : renderAlertMessage()}
        </>
      )}
    </SharedPageLayout>
  )
}

export default PrisonCases
