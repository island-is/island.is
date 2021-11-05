import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Application } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'

const useMyApplication = () => {
  const router = useRouter()

  const [myApplication, updateApplication] = useState<Application>()

  const [getApplication, { data, error, loading }] = useLazyQuery<
    {
      application: Application
    },
    { input: { id: string } }
  >(ApplicationQuery)

  if (
    router.query.id &&
    !router.route.includes('/midstod') &&
    myApplication === undefined &&
    loading === false &&
    error === undefined
  ) {
    try {
      getApplication({
        variables: {
          input: { id: router.query.id as string },
        },
      })

      if (data) {
        updateApplication(data.application)
      }
    } catch {
      return {
        myApplication,
        error,
        loading,
      }
    }
  }

  return {
    myApplication,
    error,
    loading,
  }
}

export default useMyApplication
