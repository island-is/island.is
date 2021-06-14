import React, { useEffect, useState, useContext } from 'react'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Loading,
  Logo,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseState,
  CaseTransition,
  CaseType,
  Feature,
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
import ActiveRequests from './ActiveRequests'
import PastRequests from './PastRequests'
import router from 'next/router'
import * as styles from './Requests.treat'
import { FeatureContext } from '@island.is/judicial-system-web/src/shared-components/FeatureProvider/FeatureProvider'

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const Requests: React.FC = () => {
  const [activeCases, setActiveCases] = useState<Case[]>()
  const [pastCases, setPastCases] = useState<Case[]>()

  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
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

      setActiveCases(
        casesWithoutDeleted.filter((c: Case) => {
          return isProsecutor
            ? c.state !== CaseState.ACCEPTED && c.state !== CaseState.REJECTED
            : // Judges and registrars should see all cases except cases with status code NEW.
            isJudge || isRegistrar
            ? c.state !== CaseState.NEW &&
              c.state !== CaseState.ACCEPTED &&
              c.state !== CaseState.REJECTED
            : null
        }),
      )

      setPastCases(
        casesWithoutDeleted.filter((c: Case) => {
          return (
            c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED
          )
        }),
      )
    }
  }, [
    activeCases,
    setActiveCases,
    isProsecutor,
    isJudge,
    isRegistrar,
    resCases,
  ])

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

  const handleRowClick = (id: string) => {
    const caseToOpen = resCases.find((c: Case) => c.id === id)

    if (user?.role) {
      openCase(caseToOpen, user.role)
    }
  }

  const openCase = (caseToOpen: Case, role: UserRole) => {
    if (
      caseToOpen.state === CaseState.ACCEPTED ||
      caseToOpen.state === CaseState.REJECTED
    ) {
      router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${caseToOpen.id}`)
    } else if (role === UserRole.JUDGE || role === UserRole.REGISTRAR) {
      if (
        caseToOpen.type === CaseType.CUSTODY ||
        caseToOpen.type === CaseType.TRAVEL_BAN
      ) {
        router.push(
          `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${caseToOpen.id}`,
        )
      } else {
        router.push(`${Constants.R_CASE_OVERVIEW}/${caseToOpen.id}`)
      }
    } else {
      if (
        caseToOpen.type === CaseType.CUSTODY ||
        caseToOpen.type === CaseType.TRAVEL_BAN
      ) {
        router.push(`${Constants.STEP_ONE_ROUTE}/${caseToOpen.id}`)
      } else {
        router.push(`${Constants.R_CASE_DEFENDANT_ROUTE}/${caseToOpen.id}`)
      }
    }
  }

  return (
    <div className={styles.requestsContainer}>
      {user && (
        <div className={styles.logoContainer}>
          <Logo />
          {isProsecutor && (
            <DropdownMenu
              menuLabel="Tegund kröfu"
              icon="add"
              items={
                features.includes(Feature.R_CASES)
                  ? [
                      {
                        href: Constants.STEP_ONE_CUSTODY_REQUEST_ROUTE,
                        title: 'Gæsluvarðhald',
                      },
                      {
                        href: Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE,
                        title: 'Farbann',
                      },
                      {
                        href: Constants.NEW_R_CASE_ROUTE,
                        title: 'Rannsóknarheimild',
                      },
                    ]
                  : [
                      {
                        href: Constants.STEP_ONE_CUSTODY_REQUEST_ROUTE,
                        title: 'Gæsluvarðhald',
                      },
                      {
                        href: Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE,
                        title: 'Farbann',
                      },
                    ]
              }
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
            <ActiveRequests
              cases={activeCases}
              onRowClick={handleRowClick}
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
            <PastRequests cases={pastCases} onRowClick={handleRowClick} />
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
          className={styles.requestsError}
          data-testid="custody-requests-error"
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

export default Requests
