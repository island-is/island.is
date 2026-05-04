import { useCallback } from 'react'
import { useRouter } from 'next/router'
import type { ApolloError } from '@apollo/client'

import { usePoliceDigitalCaseFileTokenUrlLazyQuery } from '@island.is/judicial-system-web/src/utils/hooks/usePoliceDigitalCaseFile/policeDigitalCaseFileTokenUrl.generated'
import { findProblemInApolloError } from '@island.is/shared/problem'

import RouteHandler, {
  policeDigitalCaseFileNotPublishedResult,
} from '../RouteHandler/RouteHandler'

const HTTP_STATUS_TOO_EARLY = 425

const isTooEarlyProblem = (error: ApolloError | undefined) => {
  const problem = findProblemInApolloError(error)
  return problem?.status === HTTP_STATUS_TOO_EARLY
}

const PoliceDigitalFileRedirect = () => {
  const router = useRouter()
  const caseId = router.query.caseId?.toString()
  const fileId = router.query.fileId?.toString()

  const [getTokenUrl] = usePoliceDigitalCaseFileTokenUrlLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const resolve = useCallback(async () => {
    if (!router.isReady) {
      return undefined
    }

    if (!caseId || !fileId) {
      return null
    }

    const result = await getTokenUrl({
      variables: { input: { caseId, policeDigitalFileId: fileId } },
    })

    if (result.error) {
      if (isTooEarlyProblem(result.error)) {
        return policeDigitalCaseFileNotPublishedResult
      }
      return null
    }

    return result.data?.policeDigitalCaseFileTokenUrl ?? null
  }, [router.isReady, caseId, fileId, getTokenUrl])

  return <RouteHandler resolve={resolve} />
}

export default PoliceDigitalFileRedirect
