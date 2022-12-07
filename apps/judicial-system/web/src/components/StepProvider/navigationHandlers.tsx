import { NextRouter } from 'next/router'

import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'
import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages/Core/errors'

export const handleNavigateFromCreateRestrictionCase = async (
  router: NextRouter,
  theCase: Case,
  createCaseHandler: (theCase: Case) => Promise<Case | undefined>,
  updateDefendantHandler: (
    caseId: string,
    defendantId: string,
    update: UpdateDefendant,
  ) => Promise<boolean | undefined>,
) => {
  const createdCase = await createCaseHandler(theCase)

  if (
    createdCase &&
    createdCase.defendants &&
    createdCase.defendants.length > 0 &&
    theCase.defendants &&
    theCase.defendants.length > 0
  ) {
    await updateDefendantHandler(createdCase.id, createdCase.defendants[0].id, {
      gender: theCase.defendants[0].gender,
      name: theCase.defendants[0].name,
      address: theCase.defendants[0].address,
      nationalId: theCase.defendants[0].nationalId,
      noNationalId: theCase.defendants[0].noNationalId,
      citizenship: theCase.defendants[0].citizenship,
    })

    router.push(
      `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
    )
  }
}

export const handleNavigateFromHearingArrangementsRestrictionCases = async (
  router: NextRouter,
  theCase: Case,
  setTheCase: React.Dispatch<React.SetStateAction<Case>>,
  transitionCaseHandler: (
    theCase: Case,
    transition: CaseTransition,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => Promise<boolean>,
  formatMessageHandler: any,
) => {
  const caseOpened =
    theCase.state === CaseState.NEW
      ? await transitionCaseHandler(theCase, CaseTransition.OPEN, setTheCase)
      : true

  if (caseOpened) {
    if (
      (theCase.state !== CaseState.NEW && theCase.state !== CaseState.DRAFT) ||
      // TODO: Ignore failed notifications
      theCase.notifications?.find(
        (notification) => notification.type === NotificationType.HEADS_UP,
      )
    ) {
      return router.push(
        `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${theCase.id}`,
      )
    } else {
      return false
    }
  } else {
    toast.error(formatMessageHandler(errors.transitionCase))
  }
}
