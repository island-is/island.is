import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useRevalidator } from 'react-router-dom'

import { validateFormData } from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import { usePublishPermissionMutation } from './PublishPermission.generated'
import { publishSchema } from '../../../utils/schemas'
import { PublishPermissionForm } from '../../../components/PublishPermissionForm'
import { usePermission } from '../PermissionContext'
import { m } from '../../../lib/messages'

export const PublishPermission = () => {
  const { tenant: tenantId, permission: permissionId } = useParams() as {
    tenant: string
    permission: string
  }
  const { revalidate } = useRevalidator()
  const {
    permission: { availableEnvironments },
    publishData,
    selectedPermission,
    updatePublishData,
    changeEnvironment,
  } = usePermission()
  const [publishPermission, { data, loading, error: publishError }] =
    usePublishPermissionMutation()
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
        await publishPermission({
          variables: {
            input: {
              scopeName: permissionId,
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
    [publishPermission, tenantId],
  )

  const onChange = useCallback((env: AuthAdminEnvironment) => {
    updatePublishData({
      ...(publishData
        ? publishData
        : { toEnvironment: selectedPermission.environment }),
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
    const env = data?.publishAuthAdminScope?.environment

    if (env) {
      changeEnvironment(data.publishAuthAdminScope.environment)
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
      description={m.publishPermissionEnvDesc}
    />
  )
}
