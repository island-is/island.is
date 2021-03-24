import React, { useEffect, useState, useContext, useMemo } from 'react'
import { AlertMessage, Box, Text, Tag } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Loading,
  Logo,
  Table,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import * as styles from './DetentionRequests.treat'
import { formatDate } from '@island.is/judicial-system/formatters'
import parseISO from 'date-fns/parseISO'
import { handleClick, mapCaseStateToTagVariant } from './utils'
import ActiveDetentionRequests from './ActiveDetentionRequests'

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const DetentionRequests: React.FC = () => {
  const [activeCases, setActiveCases] = useState<Case[]>()
  const [pastCases, setPastCases] = useState<Case[]>()

  const { user } = useContext(UserContext)
  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isJudge = user?.role === UserRole.JUDGE
  const isRegistrar = user?.role === UserRole.REGISTRAR

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)
  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.REVOKED,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const resCases = data?.cases

  useEffect(() => {
    document.title = 'Allar kröfur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (resCases && !activeCases) {
      // Remove deleted cases
      const casesWithoutDeleted = resCases.filter((c: Case) => {
        return c.state !== CaseState.DELETED
      })
      if (isProsecutor) {
        setActiveCases(
          casesWithoutDeleted.filter((c: Case) => {
            return (
              c.state !== CaseState.ACCEPTED && c.state !== CaseState.REJECTED
            )
          }),
        )

        setPastCases(
          casesWithoutDeleted.filter((c: Case) => {
            return (
              c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED
            )
          }),
        )
      } else if (isJudge || isRegistrar) {
        const judgeCases = casesWithoutDeleted.filter((c: Case) => {
          // Judges should see all cases except cases with status code NEW.
          return c.state !== CaseState.NEW
        })

        setActiveCases(judgeCases)
      } else {
        setActiveCases([])
      }
    }
  }, [
    activeCases,
    setActiveCases,
    isProsecutor,
    isJudge,
    isRegistrar,
    resCases,
  ])

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
          row: { original: { type: CaseType; parentCase: any } }
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

  const pastRequestsData = useMemo(() => pastCases, [pastCases])
  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const deleteCase = async (caseToDelete: Case) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      const transitionRequest = parseTransition(
        caseToDelete.modified,
        CaseTransition.DELETE,
      )

      try {
        const { data } = await transitionCaseMutation({
          variables: { input: { id: caseToDelete.id, ...transitionRequest } },
        })
        if (!data) {
          return
        }

        setTimeout(() => {
          setActiveCases(
            activeCases?.filter((c: Case) => {
              return c !== caseToDelete
            }),
          )
        }, 800)

        clearTimeout()

        const sent = await sendNotification(caseToDelete.id)

        if (!sent) {
          // TODO: Handle error
        }
      } catch (e) {
        // TODO: Handle error
      }
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      {user && (
        <div className={styles.logoContainer}>
          <Logo />
          {isProsecutor && (
            <DropdownMenu
              menuLabel="Tegund kröfu"
              icon="add"
              items={[
                {
                  href: Constants.STEP_ONE_NEW_DETENTION_ROUTE,
                  title: 'Gæsluvarðhald',
                },
                {
                  href: Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE,
                  title: 'Farbann',
                },
              ]}
              title="Stofna nýja kröfu"
            />
          )}
        </div>
      )}
      {activeCases || pastCases ? (
        <>
          <Box marginBottom={3} className={styles.activeRequestsTableCaption}>
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <Text variant="h3" id="activeRequestsTableCaption">
              Kröfur í vinnslu
            </Text>
          </Box>
          {activeCases && activeCases.length > 0 ? (
            <ActiveDetentionRequests
              cases={activeCases}
              onDeleteCase={deleteCase}
            />
          ) : (
            <div className={styles.activeRequestsTableInfo}>
              <AlertMessage
                title="Engar kröfur í vinnslu."
                message="Allar kröfur hafa verið afgreiddar."
                type="info"
              />
            </div>
          )}
          <Box marginBottom={3} className={styles.pastRequestsTableCaption}>
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <Text variant="h3" id="activeRequestsTableCaption">
              Afgreiddar kröfur
            </Text>
          </Box>
          {pastCases && pastCases.length > 0 ? (
            <Table
              columns={pastRequestsColumns}
              data={pastRequestsData || []}
              handleRowClick={handleClick}
              className={styles.pastRequestsTable}
              sortableColumnIds={sortableColumnIds}
            />
          ) : (
            <div className={styles.activeRequestsTableInfo}>
              <AlertMessage
                title="Engar kröfur hafa verið afgreiddar."
                message="Allar kröfur eru í vinnslu."
                type="info"
              />
            </div>
          )}
        </>
      ) : error ? (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      ) : loading ? (
        <Box className={styles.activeRequestsTable}>
          <Loading />
        </Box>
      ) : null}
    </div>
  )
}

export default DetentionRequests
