import { useQuery } from '@apollo/client'
import {
  GET_APPLICATION,
  PAYMENT_STATUS,
  removeTypename,
} from '@island.is/form-system/graphql'
import { ApplicationLoading } from '@island.is/form-system/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ErrorShell } from '../components/ErrorShell/ErrorShell'
import { ApplicationProvider } from '../context/ApplicationProvider'

type UseParams = {
  slug: string
  id: string
}

const MAX_POLL_ATTEMPTS = 15

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const [searchParams] = useSearchParams()
  const isDone = searchParams.has('done')

  const [continuePolling, setContinuePolling] = useState(isDone)
  const pollCountRef = useRef(0)
  const stopPolling = useCallback(() => setContinuePolling(false), [])

  const { data: paymentData } = useQuery(PAYMENT_STATUS, {
    variables: { input: { applicationId: id } },
    skip: !id || !continuePolling,
    pollInterval: 4000,
    fetchPolicy: 'network-only',
  })

  const paymentFulfilled =
    paymentData?.formSystemPaymentStatus?.fulfilled === true

  useEffect(() => {
    if (!continuePolling) return
    if (paymentFulfilled) {
      stopPolling()
      return
    }
    pollCountRef.current++
    if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
      stopPolling()
    }
  }, [paymentData, paymentFulfilled, continuePolling, stopPolling])

  const readyToLoad = !isDone || !continuePolling

  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: { input: { id, slug } },
    skip: !id || !readyToLoad,
    fetchPolicy: 'no-cache',
  })

  if (!id || !slug) {
    return <ErrorShell errorType="notFound" />
  }

  if (!readyToLoad || loading) {
    return <ApplicationLoading />
  }

  const formSystemApp = data?.formSystemApplication
  const isLoginTypeAllowed = formSystemApp?.isLoginTypeAllowed
  const application = removeTypename(formSystemApp?.application)

  if (error || isLoginTypeAllowed === false || !application) {
    return <ErrorShell errorType="idNotFound" />
  }

  return <ApplicationProvider application={application} />
}
