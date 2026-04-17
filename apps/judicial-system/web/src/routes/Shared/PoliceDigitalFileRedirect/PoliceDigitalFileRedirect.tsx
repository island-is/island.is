import { useCallback } from 'react'
import { useRouter } from 'next/router'

import { usePoliceDigitalCaseFileTokenUrlLazyQuery } from '@island.is/judicial-system-web/src/utils/hooks/usePoliceDigitalCaseFile/policeDigitalCaseFileTokenUrl.generated'

import RouteHandler from '../RouteHandler/RouteHandler'

const PoliceDigitalFileRedirect = () => {
  const { query } = useRouter()
  const caseId = query.caseId?.toString()
  const fileId = query.fileId?.toString()

  const [getTokenUrl] = usePoliceDigitalCaseFileTokenUrlLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const resolve = useCallback(async () => {
    if (!caseId || !fileId) {
      return null
    }

    const result = await getTokenUrl({
      variables: { input: { caseId, policeDigitalFileId: fileId } },
    })

    return result.data?.policeDigitalCaseFileTokenUrl ?? null
  }, [caseId, fileId, getTokenUrl])

  return <RouteHandler resolve={resolve} />
}

export default PoliceDigitalFileRedirect
