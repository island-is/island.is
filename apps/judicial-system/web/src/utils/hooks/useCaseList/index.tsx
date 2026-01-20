import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import { useRouter } from 'next/router'

import { LoadingDots, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  DEFENDER_INDICTMENT_ROUTE,
  DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isInvestigationCase,
  isPrisonSystemUser,
  isPublicProsecutionOfficeUser,
  isRequestCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseAppealState,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { findFirstInvalidStep } from '../../formHelper'
import useCase from '../useCase'

const useCaseList = () => {
  const timeouts = useMemo<NodeJS.Timeout[]>(() => [], [])
  // The id of the case that's about to be opened
  const [clickedCase, setClickedCase] = useState<{
    id: string | null
    defendantIds?: string[] | null
    showLoading: boolean
  }>({ id: null, defendantIds: null, showLoading: false })
  const { user, limitedAccess } = useContext(UserContext)
  const { getCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { isTransitioningCase, isSendingNotification } = useCase()
  const router = useRouter()

  const openCase = useCallback(
    (caseToOpen: Case, openCaseInNewTab?: boolean) => {
      let routeTo = null

      if (isDefenceUser(user)) {
        if (isRequestCase(caseToOpen.type)) {
          routeTo = DEFENDER_ROUTE
        } else {
          routeTo = DEFENDER_INDICTMENT_ROUTE
        }
      } else if (isPublicProsecutionOfficeUser(user)) {
        // Public prosecutor users can only see completed indictments
        routeTo = constants.PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE
      } else if (isCourtOfAppealsUser(user)) {
        // Court of appeals users can only see appealed request cases
        if (caseToOpen.appealState === CaseAppealState.COMPLETED) {
          routeTo = constants.COURT_OF_APPEAL_RESULT_ROUTE
        } else {
          routeTo = constants.COURT_OF_APPEAL_OVERVIEW_ROUTE
        }
      } else if (isDistrictCourtUser(user)) {
        if (isRestrictionCase(caseToOpen.type)) {
          if (isCompletedCase(caseToOpen.state)) {
            routeTo = constants.SIGNED_VERDICT_OVERVIEW_ROUTE
          } else {
            routeTo = findFirstInvalidStep(
              constants.courtRestrictionCasesRoutes,
              caseToOpen,
            )
          }
        } else if (isInvestigationCase(caseToOpen.type)) {
          if (isCompletedCase(caseToOpen.state)) {
            routeTo = constants.SIGNED_VERDICT_OVERVIEW_ROUTE
          } else {
            routeTo = findFirstInvalidStep(
              constants.courtInvestigationCasesRoutes,
              caseToOpen,
            )
          }
        } else {
          if (isCompletedCase(caseToOpen.state)) {
            if (caseToOpen.state === CaseState.CORRECTING) {
              routeTo = constants.INDICTMENTS_COURT_OVERVIEW_ROUTE
            } else {
              routeTo = constants.INDICTMENTS_COMPLETED_ROUTE
            }
          } else {
            // Route to Indictment Overview section since it always a valid step and
            // would be skipped if we route to the last valid step
            routeTo = constants.INDICTMENTS_COURT_OVERVIEW_ROUTE
          }
        }
      } else {
        // The user is a prosecution or prison system user. They can only see completed cases
        if (isRestrictionCase(caseToOpen.type)) {
          if (isCompletedCase(caseToOpen.state)) {
            routeTo = isPrisonSystemUser(user)
              ? constants.PRISON_SIGNED_VERDICT_OVERVIEW_ROUTE
              : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
          } else {
            routeTo = findFirstInvalidStep(
              constants.prosecutorRestrictionCasesRoutes,
              caseToOpen,
            )
          }
        } else if (isInvestigationCase(caseToOpen.type)) {
          if (isCompletedCase(caseToOpen.state)) {
            routeTo = isPrisonSystemUser(user)
              ? constants.PRISON_SIGNED_VERDICT_OVERVIEW_ROUTE
              : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
          } else {
            routeTo = findFirstInvalidStep(
              constants.prosecutorInvestigationCasesRoutes,
              caseToOpen,
            )
          }
        } else {
          if (isCompletedCase(caseToOpen.state)) {
            routeTo = isPrisonSystemUser(user)
              ? constants.PRISON_CLOSED_INDICTMENT_OVERVIEW_ROUTE
              : constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
          } else {
            routeTo = findFirstInvalidStep(
              constants.prosecutorIndictmentRoutes,
              caseToOpen,
            )
          }
        }
      }

      if (openCaseInNewTab) {
        window.open(`${routeTo}/${caseToOpen.id}`, '_blank')
      } else if (routeTo) {
        router.push(`${routeTo}/${caseToOpen.id}`)
      }
    },
    [router, user],
  )

  const handleOpenCase = useCallback(
    async (
      id: string,
      openInNewTab?: boolean,
      defendantIds?: string[] | null,
    ) => {
      const clearTimeouts = () => {
        timeouts.map((timeout) => clearTimeout(timeout))
      }

      clearTimeouts()

      if (
        (clickedCase.id !== id || clickedCase.defendantIds !== defendantIds) &&
        !openInNewTab
      ) {
        setClickedCase({ id, defendantIds, showLoading: false })

        timeouts.push(
          setTimeout(
            () => setClickedCase({ id, defendantIds, showLoading: true }),
            2000,
          ),
        )
      }

      const getCaseToOpen = (id: string) => {
        getCase(
          id,
          (caseData) => openCase(caseData, openInNewTab),
          () => {
            setClickedCase((prev) => {
              if (prev.id === id && prev.defendantIds === defendantIds) {
                clearTimeouts()

                return { id: null, defendantIds: null, showLoading: false }
              }

              return prev
            })
            toast.error(formatMessage(errors.getCaseToOpen))
          },
        )
      }

      if (
        isTransitioningCase ||
        isSendingNotification ||
        (clickedCase.id === id && clickedCase.defendantIds === defendantIds) ||
        limitedAccess === undefined
      ) {
        return
      }

      getCaseToOpen(id)
    },
    [
      clickedCase,
      formatMessage,
      getCase,
      isSendingNotification,
      isTransitioningCase,
      limitedAccess,
      openCase,
      timeouts,
    ],
  )

  const LoadingIndicator = () => {
    return (
      <motion.div
        key={`${clickedCase.id}-${clickedCase.defendantIds}-loading`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingDots single />
      </motion.div>
    )
  }

  return {
    isOpeningCaseId: clickedCase.id,
    isOpeningDefendantIds: clickedCase.defendantIds,
    showLoading: clickedCase.showLoading,
    handleOpenCase,
    LoadingIndicator,
  }
}

export default useCaseList
