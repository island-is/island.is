import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  districtCourtAbbreviation,
} from '@island.is/judicial-system/formatters'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  CasesLayout,
  CaseTag,
  Logo,
  PageHeader,
  SectionHeading,
  TagAppealState,
  TagCaseState,
  useOpenCaseInNewTab,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  getDurationDate,
  TableDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import TagContainer from '@island.is/judicial-system-web/src/components/Tags/TagContainer/TagContainer'
import TagIndictmentRulingDecision from '@island.is/judicial-system-web/src/components/Tags/TagIndictmentRulingDecision/TagIndictmentRulingDecison'
import {
  getPrisonCaseStateTag,
  getPunishmentTypeTag,
} from '@island.is/judicial-system-web/src/components/Tags/utils'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  CaseType,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

import { usePrisonCasesQuery } from './prisonCases.generated'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const PrisonCases: FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { openCaseInNewTab } = useOpenCaseInNewTab()

  const isPrisonAdmin = user?.institution?.type === InstitutionType.PRISON_ADMIN

  const { data, error, loading } = usePrisonCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const [activeCases, pastCases, registeredCases, unregisteredCases] =
    useMemo(() => {
      if (!resCases) {
        return [[], [], [], []]
      }

      const [indictmentCases, otherCases] = partition(
        resCases,
        (c) => c.type === CaseType.INDICTMENT,
      )
      const [activeCases, pastCases] = partition(
        otherCases,
        (c) => !c.isValidToDateInThePast,
      )

      const [registeredCases, unregisteredCases] = partition(
        indictmentCases,
        (c) => c.isRegisteredInPrisonSystem,
      )

      return [activeCases, pastCases, registeredCases, unregisteredCases]
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
              sortBy: 'defendants',
            },
            {
              title: formatMessage(tables.type),
            },
            {
              title: capitalize(formatMessage(tables.sentToCourtDate)),
              sortBy: 'caseSentToCourtDate',
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
              cell: (row) => (
                <TableDate displayDate={row.caseSentToCourtDate} />
              ),
            },
            {
              cell: (row) => (
                <TagContainer>
                  <TagCaseState theCase={row} />
                  {row.appealState && (
                    <TagAppealState
                      appealState={row.appealState}
                      appealRulingDecision={row.appealRulingDecision}
                    />
                  )}
                </TagContainer>
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
          generateContextMenuItems={(row) => [openCaseInNewTab(row.id)]}
        />
      )
    },
    [formatMessage, openCaseInNewTab],
  )

  const renderIndictmentTable = useMemo(
    () => (cases: CaseListEntry[]) => {
      return (
        <Table
          thead={[
            {
              title: formatMessage(tables.caseNumber),
              sortBy: 'courtCaseNumber',
            },
            {
              title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
              sortBy: 'defendants',
            },
            {
              title: formatMessage(tables.type),
            },
            {
              title: formatMessage(tables.punishmentType),
              sortBy: 'defendantsPunishmentType',
            },
            {
              title: capitalize(formatMessage(tables.sentencingDate)),
            },
            { title: formatMessage(tables.state) },
          ]}
          data={cases}
          columns={[
            {
              cell: (row) => {
                const courtAbbreviation = districtCourtAbbreviation(
                  row.court?.name,
                )

                return (
                  <CourtCaseNumber
                    courtCaseNumber={`${
                      courtAbbreviation ? `${courtAbbreviation}: ` : ''
                    }${row.courtCaseNumber ?? ''}`}
                    policeCaseNumbers={row.policeCaseNumbers ?? []}
                    appealCaseNumber={row.appealCaseNumber ?? ''}
                  />
                )
              },
            },
            {
              cell: (row) => <DefendantInfo defendants={row.defendants} />,
            },
            {
              cell: (row) => (
                <TagIndictmentRulingDecision
                  isFine={
                    row.indictmentRulingDecision ===
                    CaseIndictmentRulingDecision.FINE
                  }
                />
              ),
            },
            {
              cell: (row) => {
                const punishmentType = isNonEmptyArray(row.defendants)
                  ? row.defendants[0].punishmentType
                  : undefined
                const punishmentTypeTag = getPunishmentTypeTag(punishmentType)
                return punishmentTypeTag ? (
                  <CaseTag
                    color={punishmentTypeTag.color}
                    text={formatMessage(punishmentTypeTag.text)}
                  />
                ) : null
              },
            },
            {
              cell: (row) => <TableDate displayDate={row.rulingDate} />,
            },
            {
              cell: (row) => {
                const prisonCaseState =
                  row.defendants &&
                  row.defendants?.length > 0 &&
                  row.defendants[0].openedByPrisonAdminDate
                    ? CaseState.RECEIVED
                    : CaseState.NEW
                const prisonCaseStateTag =
                  getPrisonCaseStateTag(prisonCaseState)

                return (
                  <CaseTag
                    color={prisonCaseStateTag.color}
                    text={formatMessage(prisonCaseStateTag.text)}
                  />
                )
              },
            },
          ]}
          generateContextMenuItems={(row) => [openCaseInNewTab(row.id)]}
        />
      )
    },
    [formatMessage, openCaseInNewTab],
  )

  const renderAlertMessage = () => {
    return (
      <div className={styles.infoContainer}>
        <AlertMessage
          type="info"
          title="Engin mál fundust"
          message="Engin mál fundust í þessum flokk"
        />
      </div>
    )
  }

  return (
    <CasesLayout>
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
                {loading || !user || unregisteredCases.length > 0
                  ? renderIndictmentTable(unregisteredCases)
                  : renderAlertMessage()}
              </Box>

              <SectionHeading
                title={formatMessage(
                  m.activeRequests.prisonStaffUsers
                    .prisonAdminIndictmentCaseTitleRegisteredCases,
                )}
              />
              <Box marginBottom={[5, 5, 12]}>
                {loading || !user || registeredCases.length > 0
                  ? renderIndictmentTable(registeredCases)
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
    </CasesLayout>
  )
}

export default PrisonCases
