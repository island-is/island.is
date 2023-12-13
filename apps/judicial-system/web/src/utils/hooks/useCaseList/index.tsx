import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { Box, LoadingDots, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseState,
  InstitutionType,
  isDistrictCourtUser,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  useCaseLazyQuery,
  useLimitedAccessCaseLazyQuery,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { findFirstInvalidStep } from '../../formHelper'
import { isTrafficViolationCase } from '../../stepHelper'
import useCase from '../useCase'

const useCaseList = () => {
  // The id of the case that's about to be opened
  const [isOpeningCaseId, setIsOpeningCaseId] = useState<string>()

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
      } else if (user?.institution?.type === InstitutionType.COURT_OF_APPEALS) {
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
      setIsOpeningCaseId(id)

      const getCaseToOpen = (id: string) => {
        limitedAccess
          ? getLimitedAccessCase({ variables: { input: { id } } })
          : getCase({ variables: { input: { id } } })
      }

      if (
        isTransitioningCase ||
        isSendingNotification ||
        isOpeningCaseId === id ||
        !user?.role
      ) {
        return
      }
      console.log('a')

      // getCaseToOpen(id)
    },
    [
      getCase,
      getLimitedAccessCase,
      isOpeningCaseId,
      isSendingNotification,
      isTransitioningCase,
      limitedAccess,
      user?.role,
    ],
  )

  const LoadingIndicator = () => {
    console.log('asdasd')
    return (
      <motion.div
        key={`${isOpeningCaseId}-loading`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 2 } }}
        exit={{ opacity: 0 }}
      >
        <LoadingDots single />
      </motion.div>
    )
  }

  return { isOpeningCaseId, handleOpenCase, LoadingIndicator }
}

export default useCaseList
