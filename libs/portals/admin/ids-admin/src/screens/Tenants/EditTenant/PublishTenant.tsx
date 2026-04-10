import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useRevalidator } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { validateFormData } from '@island.is/react-spa/shared'

import { PublishPermissionForm } from '../../../components/PublishPermissionForm'
import { m } from '../../../lib/messages'
import { publishSchema } from '../../../utils/schemas'
import { usePublishTenantMutation } from '../Tenants.generated'
import { useTenant } from './TenantContext'

export const PublishTenant = () => {
  const { tenant: tenantId } = useParams() as { tenant: string }
  const { revalidate } = useRevalidator()
  const {
    tenant,
    publishData,
    selectedEnvironment,
    updatePublishData,
    changeEnvironment,
  } = useTenant()

  const [publishTenant, { data, loading, error: publishError }] =
    usePublishTenantMutation()
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
        await publishTenant({
          variables: {
            input: {
              tenantId,
              sourceEnvironment: data.sourceEnvironment,
              targetEnvironment: data.targetEnvironment,
            },
          },
        })
      } catch (e) {
        setError(true)
      }
    },
    [publishTenant, tenantId],
  )

  const onChange = useCallback(
    (env: AuthAdminEnvironment) => {
      updatePublishData({
        ...(publishData
          ? publishData
          : { toEnvironment: selectedEnvironment.environment }),
        fromEnvironment: env,
      })
    },
    [publishData, selectedEnvironment, updatePublishData],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (publishData) {
      setIsVisible(true)
    }
  }, [publishData])

  useEffect(() => {
    const env = data?.publishAuthAdminTenant?.environment

    if (env) {
      changeEnvironment(env)
      revalidate()
      onClose()
    }
  }, [data, revalidate, changeEnvironment, onClose])

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
      availableEnvironments={tenant.availableEnvironments}
      onChange={onChange}
      error={error}
      loading={loading}
      description={m.publishTenantEnvDesc}
    />
  )
}

export default PublishTenant
