import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Application } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'

const useMyApplication = () => {
  const router = useRouter()

  const storageKey = 'myCurrentApplication'

  const [myApplication, updateApplication] = useState<Application>()

  const [getApplication, { data, error, loading }] = useLazyQuery<
    {
      application: Application
    },
    { input: { id: string } }
  >(ApplicationQuery)

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    updateApplication(storedState)
  }, [])

  if (router.query.id && myApplication === undefined && loading === false) {
    try {
      getApplication({
        variables: {
          input: { id: router.query.id as string },
        },
      })

      if (data) {
        updateApplication(data.application)
        sessionStorage.setItem(storageKey, JSON.stringify(data.application))
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
