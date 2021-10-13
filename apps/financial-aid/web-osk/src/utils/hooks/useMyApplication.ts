import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { GetApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Application } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'

interface ApplicantData {
  application?: Application
}

const useMyApplication = () => {
  const router = useRouter()
  const storageKey = 'myCurrentApplication'

  const [myApplication, updateApplication] = useState<Application>()

  const { data, error, loading } = useQuery<ApplicantData>(
    GetApplicationQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    const storedFormJson = sessionStorage.getItem(storageKey)
    if (storedFormJson === null) {
      return
    }
    const storedState = JSON.parse(storedFormJson)
    updateApplication(storedState)
  }, [])

  useEffect(() => {
    if (data) {
      updateApplication(data.application)
      // Watches the user state and writes it to local storage on change
      sessionStorage.setItem(storageKey, JSON.stringify(data.application))
    }
  }, [myApplication, data])

  return {
    myApplication,
    error,
    loading,
  }
}

export default useMyApplication
