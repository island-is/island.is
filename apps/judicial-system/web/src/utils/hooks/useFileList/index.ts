import { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GetSignedUrlQuery } from '@island.is/judicial-system-web/graphql/sharedGql'
import { CaseFileState } from '@island.is/judicial-system/types'
import {
  GetSignedUrlQueryQuery,
  GetSignedUrlQueryQueryVariables,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { FormContext } from '@island.is/judicial-system-web/src/components'

interface Parameters {
  caseId: string
}

const useFileList = ({ caseId }: Parameters) => {
  const { setWorkingCase } = useContext(FormContext)
  const [fileNotFound, setFileNotFound] = useState<boolean>()

  const [getSignedUrl, { error, variables }] = useLazyQuery<
    GetSignedUrlQueryQuery,
    GetSignedUrlQueryQueryVariables
  >(GetSignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data?.getSignedUrl?.url) {
        window.open(data.getSignedUrl.url, '_blank')
      }
    },
  })

  useEffect(() => {
    if (error && variables) {
      const code = error?.graphQLErrors[0].extensions?.code

      // If the file no longer exists or access in no longer permitted
      if (
        code === 'https://httpstatuses.org/404' ||
        code === 'https://httpstatuses.org/403'
      ) {
        setFileNotFound(true)
        setWorkingCase((theCase) => ({
          ...theCase,
          caseFiles: theCase.caseFiles?.map((file) =>
            file.id === variables.input.id
              ? {
                  ...file,
                  key: undefined,
                  status:
                    file.state === CaseFileState.STORED_IN_COURT
                      ? 'done-broken'
                      : 'broken',
                }
              : file,
          ),
        }))
      }
    }
  }, [error, setWorkingCase, variables])

  const onOpen = (fileId: string) => {
    getSignedUrl({ variables: { input: { id: fileId, caseId } } })
  }

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { fileNotFound, dismissFileNotFound, onOpen }
}

export default useFileList
