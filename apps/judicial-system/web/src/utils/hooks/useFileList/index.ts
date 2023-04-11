import { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  GetLimitedAccessSignedUrlQuery,
  GetSignedUrlQuery,
} from '@island.is/judicial-system-web/graphql/sharedGql'
import { CaseFileState } from '@island.is/judicial-system/types'
import {
  GetLimitedAccessSignedUrlQueryQuery,
  GetLimitedAccessSignedUrlQueryQueryVariables,
  GetSignedUrlQueryQuery,
  GetSignedUrlQueryQueryVariables,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { FormContext } from '@island.is/judicial-system-web/src/components'

interface Parameters {
  caseId: string
  limitedAccess?: boolean
}

const useFileList = ({ caseId, limitedAccess = false }: Parameters) => {
  const { setWorkingCase } = useContext(FormContext)
  const [fileNotFound, setFileNotFound] = useState<boolean>()

  const [
    getSignedUrl,
    { error: fullAccessError, variables: fullAccessVariables },
  ] = useLazyQuery<GetSignedUrlQueryQuery, GetSignedUrlQueryQueryVariables>(
    GetSignedUrlQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted(data) {
        if (data?.getSignedUrl?.url) {
          window.open(data.getSignedUrl.url, '_blank')
        }
      },
    },
  )

  const [
    getLimitedAccessSignedUrl,
    { error: limitedAccessError, variables: limitedAccessVariables },
  ] = useLazyQuery<
    GetLimitedAccessSignedUrlQueryQuery,
    GetLimitedAccessSignedUrlQueryQueryVariables
  >(GetLimitedAccessSignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data?.getLimitedAccessSignedUrl?.url) {
        window.open(data.getLimitedAccessSignedUrl.url, '_blank')
      }
    },
  })

  useEffect(() => {
    const error = limitedAccess ? limitedAccessError : fullAccessError
    const variables = limitedAccess
      ? limitedAccessVariables
      : fullAccessVariables

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
  }, [
    fullAccessError,
    fullAccessVariables,
    limitedAccess,
    limitedAccessError,
    limitedAccessVariables,
    setWorkingCase,
  ])

  const onOpen = (fileId: string) => {
    if (limitedAccess) {
      getLimitedAccessSignedUrl({
        variables: { input: { id: fileId, caseId } },
      })
    } else {
      getSignedUrl({ variables: { input: { id: fileId, caseId } } })
    }
  }

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { fileNotFound, dismissFileNotFound, onOpen }
}

export default useFileList
