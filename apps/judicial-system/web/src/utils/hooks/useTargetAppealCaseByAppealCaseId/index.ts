import { useContext } from 'react'
import { useRouter } from 'next/router'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'

// Resolves which AppealCase a Court of Appeals detail page should operate on.
// COA list rows route with `?appealCaseId=…` — the appeal id
// directly identifies the row. Defaults to the case-level appeal when no
// query param is set, preserving today's behavior for legacy URLs.
//
// A case can carry the case-level ruling appeal, an appeal of each ruling
// order, and the verdict appeal at once, so the id in the URL is the only
// thing that says which of them a page is about. Every appeal a page can be
// opened for is searched here; a page that resolved its appeal some other way
// would be a second answer to the same question.

export const resolveTargetAppealCaseByAppealCaseId = (
  workingCase: WorkingCase,
  appealCaseId: string | undefined,
): AppealCase | undefined | null => {
  if (!appealCaseId || workingCase.appealCase?.id === appealCaseId) {
    return workingCase.appealCase
  }

  if (workingCase.verdictAppealCase?.id === appealCaseId) {
    return workingCase.verdictAppealCase
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
