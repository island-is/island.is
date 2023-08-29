import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useRevalidator } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { validateFormData } from '@island.is/react-spa/shared'

import { m } from '../../../lib/messages'
import { useClient } from '../ClientContext'
import { PublishPermissionForm } from '../../../components/PublishPermissionForm'
import { publishSchema } from '../../../utils/schemas'
import { usePublishClientMutation } from './PublishClient.generated'

export const PublishClient = () => {
  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }
  const { revalidate } = useRevalidator()
  const {
    client: { availableEnvironments },
    publishData,
    selectedEnvironment,
    updatePublishData,
    changeEnvironment,
  } = useClient()
  const [publishClient, { data, loading, error: publishError }] =
    usePublishClientMutation()
  const [error, setError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(false)

      const formData = new FormData(e.target as HTMLFormElement)
      const { data, errors } = await validateFormData({
        formData,
        schema: publishSchema,
      })

      if (errors || !data) {
        setError(true)
        return
      }

      try {
        await publishClient({
          variables: {
            input: {
              clientId,
              tenantId,
              targetEnvironment: data.targetEnvironment,
              sourceEnvironment: data.sourceEnvironment,
            },
          },
        })
      } catch (e) {
        setError(true)
      }
    },
    [publishClient, tenantId, clientId],
  )

  const onChange = useCallback((env: AuthAdminEnvironment) => {
    updatePublishData({
      ...(publishData
        ? publishData
        : { toEnvironment: selectedEnvironment.environment }),
      fromEnvironment: env,
    })
  }, [])

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (publishData) {
      setIsVisible(true)
    }
  }, [publishData])

  useEffect(() => {
    const env = data?.publishAuthAdminClient?.environment

    if (env) {
      changeEnvironment(data.publishAuthAdminClient.environment)
      // Be sure to re-fetch the permission if permission was published
      revalidate()
      onClose()
    }
  }, [data, revalidate])

  useEffect(() => {
    if (publishError) {
      setError(true)
    }
  }, [publishError])

  return (
    <PublishPermissionForm
      isVisible={isVisible}
      onSubmit={onSubmit}
      onClose={onClose}
      publishData={publishData}
      availableEnvironments={availableEnvironments}
      onChange={onChange}
      error={error}
      loading={loading}
      description={m.publishClientEnvDesc}
    />
  )
}

export default PublishClient
