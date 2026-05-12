import { useContext } from 'react'
import { useRouter } from 'next/router'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'

// Resolves which AppealCase the current page should operate on when the URL
// identifies it indirectly via the ruling-order file id (`?rulingFileId=…`,
// Step 6e — indictment-overview routes navigating into the appeal-submission
// flow). Defaults to the case-level appeal when no query param is set,
// preserving today's behavior for legacy URLs.

export const resolveTargetAppealCaseByRulingFileId = (
  workingCase: Case,
  rulingFileId: string | undefined,
): AppealCase | undefined | null => {
  if (!rulingFileId) {
    return workingCase.appealCase
  }

  return workingCase.rulingOrderAppealCases?.find(
    (a) => a.rulingFileId === rulingFileId,
  )
}

const useTargetAppealCaseByRulingFileId = (): AppealCase | undefined | null => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const rulingFileId =
    typeof router.query.rulingFileId === 'string'
      ? router.query.rulingFileId
      : undefined

  return resolveTargetAppealCaseByRulingFileId(workingCase, rulingFileId)
}

export default useTargetAppealCaseByRulingFileId
