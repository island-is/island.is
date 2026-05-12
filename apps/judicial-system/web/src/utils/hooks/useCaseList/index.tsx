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
  AppealCaseState,
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { compareArrays } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

import { findFirstInvalidStep } from '../../formHelper'
import useCase from '../useCase'
import { resolveTargetAppealCaseByAppealCaseId } from '../useTargetAppealCaseByAppealCaseId'

const useCaseList = () => {
  const timeouts = useMemo<NodeJS.Timeout[]>(() => [], [])
  // The case and row (defendant ids + appeal case id) that's about to be opened
  // — used for loading state only. `appealCaseId` distinguishes the case-level
  // row from each ruling-order-appeal row on the same case in COA tables.
  const [clickedCase, setClickedCase] = useState<{
    id: string | null
    defendantIds?: string[] | null
    appealCaseId?: string | null
    showLoading: boolean
  }>({
    id: null,
    defendantIds: null,
    appealCaseId: null,
    showLoading: false,
  })
  const { user, limitedAccess } = useContext(UserContext)
  const { getCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { isTransitioningCase, isSendingNotification } = useCase()
  const router = useRouter()

  const openCase = useCallback(
    (
      caseToOpen: Case,
      openCaseInNewTab?: boolean,
      appealCaseId?: string | null,
    ) => {
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
        // Court of appeals users see one row per appeal — case-level or
        // ruling-order. Pick OVERVIEW vs RESULT based on the *target* appeal's
        // state, falling back to the case-level appeal when no appealCaseId is
        // supplied.
        const targetAppealCase = resolveTargetAppealCaseByAppealCaseId(
          caseToOpen,
          appealCaseId ?? undefined,
        )

        if (targetAppealCase?.appealState === AppealCaseState.COMPLETED) {
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

      if (!routeTo) {
        return
      }

      const url =
        isCourtOfAppealsUser(user) && appealCaseId
          ? `${routeTo}/${caseToOpen.id}?appealCaseId=${appealCaseId}`
          : `${routeTo}/${caseToOpen.id}`

      if (openCaseInNewTab) {
        window.open(url, '_blank')
      } else {
        router.push(url)
      }
    },
    [router, user],
  )

  const handleOpenCase = useCallback(
    async (
      id: string,
      openInNewTab?: boolean,
      defendantIds?: string[] | null,
      appealCaseId?: string | null,
    ) => {
      const clearTimeouts = () => {
        timeouts.map((timeout) => clearTimeout(timeout))
      }

      clearTimeouts()

      const isSameRow =
        clickedCase.id === id &&
        compareArrays(clickedCase.defendantIds, defendantIds) &&
        clickedCase.appealCaseId === appealCaseId

      if (!isSameRow && !openInNewTab) {
        setClickedCase({ id, defendantIds, appealCaseId, showLoading: false })

        timeouts.push(
          setTimeout(
            () =>
              setClickedCase({
                id,
                defendantIds,
                appealCaseId,
                showLoading: true,
              }),
            2000,
          ),
        )
      }

      const getCaseToOpen = (id: string) => {
        getCase(
          id,
          (caseData) => openCase(caseData, openInNewTab, appealCaseId),
          () => {
            setClickedCase((prev) => {
              if (
                prev.id === id &&
                compareArrays(prev.defendantIds, defendantIds) &&
                prev.appealCaseId === appealCaseId
              ) {
                clearTimeouts()

                return {
                  id: null,
                  defendantIds: null,
                  appealCaseId: null,
                  showLoading: false,
                }
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
        isSameRow ||
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
        key={`${clickedCase.id}-${clickedCase.defendantIds}-${clickedCase.appealCaseId}-loading`}
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
    isOpeningAppealCaseId: clickedCase.appealCaseId,
    showLoading: clickedCase.showLoading,
    handleOpenCase,
    LoadingIndicator,
  }
}

export default useCaseList
