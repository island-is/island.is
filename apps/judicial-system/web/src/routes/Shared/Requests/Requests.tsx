import React, { useEffect, useState, useContext } from 'react'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Loading,
  Logo,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseState,
  CaseTransition,
  completedCaseStates,
  InstitutionType,
  NotificationType,
  isRestrictionCase,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import ActiveRequests from './ActiveRequests'
import PastRequests from './PastRequests'
import router from 'next/router'
import * as styles from './Requests.treat'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const Requests: React.FC = () => {
  const [activeCases, setActiveCases] = useState<Case[]>()
  const [pastCases, setPastCases] = useState<Case[]>()

  const { user } = useContext(UserContext)
  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isJudge = user?.role === UserRole.JUDGE
  const isRegistrar = user?.role === UserRole.REGISTRAR
  const isHighCourtUser = user?.institution?.type === InstitutionType.HIGH_COURT
  const isPrisonStaffUser =
    user?.institution?.type === InstitutionType.PRISON_ADMIN ||
    user?.institution?.type === InstitutionType.PRISON

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { transitionCase, sendNotification } = useCase()

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
            ? !completedCaseStates.includes(c.state)
            : // Judges and registrars should see all cases except cases with status code NEW.
            isJudge || isRegistrar
            ? ![...completedCaseStates, CaseState.NEW].includes(c.state)
            : isPrisonStaffUser
            ? [CaseState.ACCEPTED].includes(c.state) &&
              !c.isValidToDateInThePast
            : null
        }),
      )

      setPastCases(
        casesWithoutDeleted.filter((c: Case) => {
          return isPrisonStaffUser
            ? [CaseState.ACCEPTED].includes(c.state) && c.isValidToDateInThePast
            : completedCaseStates.includes(c.state)
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
    isPrisonStaffUser,
  ])

  const deleteCase = async (caseToDelete: Case) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      await sendNotification(caseToDelete.id, NotificationType.REVOKED)
      await transitionCase(caseToDelete, CaseTransition.DELETE)

      setActiveCases(
        activeCases?.filter((c: Case) => {
          return c !== caseToDelete
        }),
      )
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
      caseToOpen.state === CaseState.REJECTED ||
      caseToOpen.state === CaseState.DISMISSED
    ) {
      router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${caseToOpen.id}`)
    } else if (role === UserRole.JUDGE || role === UserRole.REGISTRAR) {
      if (isRestrictionCase(caseToOpen.type)) {
        router.push(
          `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${caseToOpen.id}`,
        )
      } else {
        router.push(`${Constants.IC_OVERVIEW_ROUTE}/${caseToOpen.id}`)
      }
    } else {
      if (isRestrictionCase(caseToOpen.type)) {
        if (
          caseToOpen.state === CaseState.RECEIVED ||
          caseToOpen.state === CaseState.SUBMITTED
        ) {
          router.push(`${Constants.STEP_SIX_ROUTE}/${caseToOpen.id}`)
        } else {
          router.push(`${Constants.STEP_ONE_ROUTE}/${caseToOpen.id}`)
        }
      } else {
        if (
          caseToOpen.state === CaseState.RECEIVED ||
          caseToOpen.state === CaseState.SUBMITTED
        ) {
          router.push(
            `${Constants.IC_POLICE_CONFIRMATION_ROUTE}/${caseToOpen.id}`,
          )
        } else {
          router.push(`${Constants.IC_DEFENDANT_ROUTE}/${caseToOpen.id}`)
        }
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
              items={[
                {
                  href: Constants.STEP_ONE_CUSTODY_REQUEST_ROUTE,
                  title: 'Gæsluvarðhald',
                },
                {
                  href: Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE,
                  title: 'Farbann',
                },
                {
                  href: Constants.NEW_IC_ROUTE,
                  title: 'Rannsóknarheimild',
                },
              ]}
              title="Stofna nýja kröfu"
            />
          )}
        </div>
      )}
      {activeCases || pastCases ? (
        <>
          {!isHighCourtUser && (
            <>
              <Box marginBottom={3}>
                {/**
                 * This should be a <caption> tag inside the table but
                 * Safari has a bug that doesn't allow that. See more
                 * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
                 */}
                <Text variant="h3" id="activeRequestsTableCaption">
                  Kröfur í vinnslu
                </Text>
              </Box>
              <Box marginBottom={15}>
                {activeCases && activeCases.length > 0 ? (
                  isPrisonStaffUser ? (
                    <PastRequests
                      cases={activeCases}
                      onRowClick={() => {
                        throw new Error('Function not implemented.')
                      }}
                      isHighCourtUser={false}
                    />
                  ) : (
                    <ActiveRequests
                      cases={activeCases}
                      onRowClick={handleRowClick}
                      onDeleteCase={deleteCase}
                    />
                  )
                ) : (
                  <div className={styles.infoContainer}>
                    <AlertMessage
                      title="Engar kröfur í vinnslu."
                      message="Allar kröfur hafa verið afgreiddar."
                      type="info"
                    />
                  </div>
                )}
              </Box>
            </>
          )}
          <Box marginBottom={3}>
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <Text variant="h3" id="activeRequestsTableCaption">
              {isHighCourtUser ? 'Kærðir úrskurðir' : 'Afgreiddar kröfur'}
            </Text>
          </Box>
          {pastCases && pastCases.length > 0 ? (
            <PastRequests
              cases={pastCases}
              onRowClick={handleRowClick}
              isHighCourtUser={isHighCourtUser}
            />
          ) : (
            <div className={styles.infoContainer}>
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
          className={styles.infoContainer}
          data-testid="custody-requests-error"
        >
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      ) : loading ? (
        <Box className={styles.table}>
          <Loading />
        </Box>
      ) : null}
    </div>
  )
}

export default Requests
