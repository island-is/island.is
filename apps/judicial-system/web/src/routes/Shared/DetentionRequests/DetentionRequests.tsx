import React, { useEffect, useState, useContext, useMemo } from 'react'
import { AlertMessage, TagVariant, Box } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Loading,
  Logo,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useRouter } from 'next/router'
import {
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import * as styles from './DetentionRequests.treat'
import ActiveRequests from './ActiveRequests'
import PastRequests from './PastRequests'

type directionType = 'ascending' | 'descending'
interface SortConfig {
  key: keyof Case
  direction: directionType
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const DetentionRequests: React.FC = () => {
  const [activeCases, setActiveCases] = useState<Case[]>()
  const [pastCases, setPastCases] = useState<Case[]>()
  const [sortConfig, setSortConfig] = useState<SortConfig>()

  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  const { user } = useContext(UserContext)
  const router = useRouter()

  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isJudge = user?.role === UserRole.JUDGE
  const isRegistrar = user?.role === UserRole.REGISTRAR

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

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

  useMemo(() => {
    const sortedCases = activeCases || []

    if (sortConfig) {
      sortedCases.sort((a: Case, b: Case) => {
        // Credit: https://stackoverflow.com/a/51169
        return sortConfig.direction === 'ascending'
          ? ('' + a[sortConfig.key]).localeCompare(
              b[sortConfig.key]?.toString() || '',
            )
          : ('' + b[sortConfig.key]).localeCompare(
              a[sortConfig.key]?.toString() || '',
            )
      })
    }
    return sortedCases
  }, [activeCases, sortConfig])

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

  const mapCaseStateToTagVariant = (
    state: CaseState,
    isCustodyEndDateInThePast?: boolean,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.NEW:
      case CaseState.DRAFT:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return {
          color: 'purple',
          text: `${isJudge ? 'Ný krafa' : 'Krafa send'}`,
        }
      case CaseState.RECEIVED:
        return { color: 'darkerMint', text: 'Krafa móttekin' }
      case CaseState.ACCEPTED:
        if (isCustodyEndDateInThePast) {
          return {
            color: 'darkerBlue',
            text: 'Lokið',
          }
        } else {
          return {
            color: 'blue',
            text: 'Virkt',
          }
        }
      case CaseState.REJECTED:
        return { color: 'rose', text: 'Kröfu hafnað' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  const handleClick = (c: Case): void => {
    if (c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED) {
      router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${c.id}`)
    } else if (isJudge || isRegistrar) {
      router.push(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    } else if (c.state === CaseState.RECEIVED && c.isCourtDateInThePast) {
      router.push(`${Constants.STEP_FIVE_ROUTE}/${c.id}`)
    } else {
      router.push(`${Constants.STEP_ONE_ROUTE}/${c.id}`)
    }
  }

  const requestSort = (key: keyof Case) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ key, direction: d })
  }

  const getClassNamesFor = (name: keyof Case) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

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

        setRequestToRemoveIndex(undefined)

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
      {activeCases && pastCases ? (
        <>
          <ActiveRequests
            requestSort={requestSort}
            getClassNamesFor={getClassNamesFor}
            isProsecutor={isProsecutor}
            cases={activeCases}
            requestToRemoveIndex={requestToRemoveIndex}
            handleClick={handleClick}
            mapCaseStateToTagVariant={mapCaseStateToTagVariant}
            setRequestToRemoveIndex={setRequestToRemoveIndex}
            deleteCase={deleteCase}
          />
          <PastRequests
            requestSort={requestSort}
            getClassNamesFor={getClassNamesFor}
            cases={pastCases}
            handleClick={handleClick}
            mapCaseStateToTagVariant={mapCaseStateToTagVariant}
          />
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
