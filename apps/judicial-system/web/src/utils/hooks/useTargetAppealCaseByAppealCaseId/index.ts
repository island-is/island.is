import { useContext } from 'react'
import { useRouter } from 'next/router'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'

// Resolves which AppealCase a Court of Appeals detail page should operate on.
// COA list rows route with `?appealCaseId=…` — the appeal id
// directly identifies the row. Defaults to the case-level appeal when no
// query param is set, preserving today's behavior for legacy URLs.

export const resolveTargetAppealCaseByAppealCaseId = (
  workingCase: Case,
  appealCaseId: string | undefined,
): AppealCase | undefined | null => {
  if (!appealCaseId || workingCase.appealCase?.id === appealCaseId) {
    return workingCase.appealCase
  }

  return workingCase.rulingOrderAppealCases?.find((a) => a.id === appealCaseId)
}

const useTargetAppealCaseByAppealCaseId = (): AppealCase | undefined | null => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const queryValue = router.query?.appealCaseId
  const appealCaseId = typeof queryValue === 'string' ? queryValue : undefined

  return resolveTargetAppealCaseByAppealCaseId(workingCase, appealCaseId)
}

export default useTargetAppealCaseByAppealCaseId
