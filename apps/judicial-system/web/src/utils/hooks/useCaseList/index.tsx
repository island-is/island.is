import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { LoadingDots, toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { useCaseLazyQuery } from '@island.is/judicial-system-web/src/components/FormProvider/case.generated'
import { useLimitedAccessCaseLazyQuery } from '@island.is/judicial-system-web/src/components/FormProvider/limitedAccessCase.generated'
import {
  CaseState,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { findFirstInvalidStep } from '../../formHelper'
import { isTrafficViolationCase } from '../../stepHelper'
import useCase from '../useCase'

const useCaseList = () => {
  const timeouts = useMemo<NodeJS.Timeout[]>(() => [], [])
  // The id of the case that's about to be opened
  const [clickedCase, setClickedCase] = useState<
    [id: string | null, showLoading: boolean]
  >([null, false])

  const { user, limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { isTransitioningCase, isSendingNotification } = useCase()
  const router = useRouter()

  const [getLimitedAccessCase] = useLimitedAccessCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (limitedAccessCaseData) => {
      if (user && limitedAccessCaseData?.limitedAccessCase) {
        openCase(limitedAccessCaseData.limitedAccessCase as Case, user)
      }
    },
    onError: () => {
      toast.error(formatMessage(errors.getCaseToOpen))
    },
  })

  const [getCase] = useCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (caseData) => {
      if (user && caseData?.case) {
        openCase(caseData.case as Case, user)
      }
    },
    onError: () => {
      toast.error(formatMessage(errors.getCaseToOpen))
    },
  })

  const openCase = (caseToOpen: Case, user: User) => {
    let routeTo = null
    const isTrafficViolation = isTrafficViolationCase(caseToOpen)

    if (
      caseToOpen.state === CaseState.ACCEPTED ||
      caseToOpen.state === CaseState.REJECTED ||
      caseToOpen.state === CaseState.DISMISSED
    ) {
      if (isIndictmentCase(caseToOpen.type)) {
        routeTo = constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
      } else if (isCourtOfAppealsUser(user)) {
        if (
          findFirstInvalidStep(constants.courtOfAppealRoutes, caseToOpen) ===
          constants.courtOfAppealRoutes[1]
        ) {
          routeTo = constants.COURT_OF_APPEAL_OVERVIEW_ROUTE
        } else {
          routeTo = findFirstInvalidStep(
            constants.courtOfAppealRoutes,
            caseToOpen,
          )
        }
      } else {
        routeTo = constants.SIGNED_VERDICT_OVERVIEW_ROUTE
      }
    } else if (isDistrictCourtUser(user)) {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.courtRestrictionCasesRoutes,
          caseToOpen,
        )
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.courtInvestigationCasesRoutes,
          caseToOpen,
        )
      } else {
        // Route to Indictment Overview section since it always a valid step and
        // would be skipped if we route to the last valid step
        routeTo = constants.INDICTMENTS_COURT_OVERVIEW_ROUTE
      }
    } else {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.prosecutorRestrictionCasesRoutes,
          caseToOpen,
        )
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.prosecutorInvestigationCasesRoutes,
          caseToOpen,
        )
      } else {
        routeTo = findFirstInvalidStep(
          constants.prosecutorIndictmentRoutes(isTrafficViolation),
          caseToOpen,
        )
      }
    }

    if (routeTo) router.push(`${routeTo}/${caseToOpen.id}`)
  }

  const handleOpenCase = useCallback(
    (id: string) => {
      Promise.all(timeouts.map((timeout) => clearTimeout(timeout)))

      setClickedCase([id, false])

      timeouts.push(
        setTimeout(() => {
          setClickedCase([id, true])
        }, 2000),
      )

      const getCaseToOpen = (id: string) => {
        limitedAccess
          ? getLimitedAccessCase({ variables: { input: { id } } })
          : getCase({ variables: { input: { id } } })
      }

      if (
        isTransitioningCase ||
        isSendingNotification ||
        clickedCase[0] === id ||
        limitedAccess === undefined
      ) {
        return
      }

      getCaseToOpen(id)
    },
    [
      clickedCase,
      getCase,
      getLimitedAccessCase,
      isSendingNotification,
      isTransitioningCase,
      limitedAccess,
      timeouts,
    ],
  )

  const LoadingIndicator = () => {
    return (
      <motion.div
        key={`${clickedCase[0]}-loading`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: theme.spacing[3],
        }}
      >
        <LoadingDots single />
      </motion.div>
    )
  }

  return {
    isOpeningCaseId: clickedCase[0],
    showLoading: clickedCase[1],
    handleOpenCase,
    LoadingIndicator,
  }
}

export default useCaseList
