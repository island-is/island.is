import { useContext } from 'react'
import { useRouter } from 'next/router'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import type {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { rulingOrderAppealCase } from '@island.is/judicial-system-web/src/utils/utils'

// Resolves which AppealCase the current page should operate on when the URL
// identifies it indirectly via the ruling-order file id (`?rulingFileId=…` —
// indictment-overview routes navigating into the appeal-submission
// flow). Defaults to the case-level appeal when no query param is set,
// preserving today's behavior for legacy URLs.

export const resolveTargetAppealCaseByRulingFileId = (
  workingCase: Case,
  rulingFileId: string | undefined,
): AppealCase | undefined | null => {
  if (!rulingFileId) {
    return workingCase.appealCase
  }

  return rulingOrderAppealCase(workingCase, rulingFileId)
}

const useTargetAppealCaseByRulingFileId = (): AppealCase | undefined | null => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const queryValue = router.query?.rulingFileId
  const rulingFileId = typeof queryValue === 'string' ? queryValue : undefined

  return resolveTargetAppealCaseByRulingFileId(workingCase, rulingFileId)
}

export default useTargetAppealCaseByRulingFileId
