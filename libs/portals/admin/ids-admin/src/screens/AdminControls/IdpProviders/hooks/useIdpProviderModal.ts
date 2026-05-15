import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../../lib/messages'
import { useEnvironmentQuery } from '../../../../hooks/useEnvironmentQuery'
import {
  authAdminEnvironments,
  pickBestEnvironment,
} from '../../../../utils/environments'
import {
  IdpProviderIntent,
  type IdpProvidersActionResult,
} from '../IdpProviders.action'
import {
  GetIdpProviderDocument,
  type GetIdpProviderQuery,
  type GetIdpProviderQueryVariables,
  useCreateIdpProviderMutation,
} from '../IdpProviders.generated'
import {
  emptyForm,
  type IdpProviderFormData,
  type IdpProviderRow,
  type FormErrors,
} from '../IdpProviders.types'
import { validateIdpProviderForm, hasErrors } from '../IdpProviders.utils'

interface UseIdpProviderModalParams {
  configuredEnvironments: AuthAdminEnvironment[]
}

export const useIdpProviderModal = ({
  configuredEnvironments,
}: UseIdpProviderModalParams) => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<IdpProvidersActionResult>()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<IdpProviderFormData>(emptyForm)
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [userAvailableEnvironments, setUserAvailableEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [loadingIdpProvider, setLoadingIdpProvider] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const lastHandledFetcherData = useRef<IdpProvidersActionResult | null>(null)

  const [fetchIdpProvider] = useLazyQuery<
    GetIdpProviderQuery,
    GetIdpProviderQueryVariables
  >(GetIdpProviderDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateIdpProviderMutation()

  const environmentWrappers = useMemo(() => {
    const envs = configuredEnvironments.map((env) => ({ environment: env }))
    return envs.length > 0
      ? envs
      : [{ environment: AuthAdminEnvironment.Development }]
  }, [configuredEnvironments])
  const { environment: selectedEnvResult, updateEnvironment } =
    useEnvironmentQuery(environmentWrappers)

  const resetModalState = useCallback(() => {
    setModalVisible(false)
    setFormData(emptyForm)
    setSelectedEnvironments([])
    setUserAvailableEnvironments([])
    setFormErrors({})
  }, [])

  useEffect(() => {
    if (!fetcher.data || fetcher.data === lastHandledFetcherData.current) {
      return
    }
    lastHandledFetcherData.current = fetcher.data

    if (!fetcher.data.globalError) {
      const data = fetcher.data.data as {
        failedEnvironments?: { environment: string; message: string }[]
      } | null

      const failedEnvs = data?.failedEnvironments

      switch (fetcher.data.intent) {
        case IdpProviderIntent.create:
          toast.success(formatMessage(m.idpProvidersCreateSuccess))
          break
        case IdpProviderIntent.update:
          toast.success(formatMessage(m.idpProvidersUpdateSuccess))
          break
        case IdpProviderIntent.delete:
          toast.success(formatMessage(m.idpProvidersDeleteSuccess))
          break
      }

      if (failedEnvs && failedEnvs.length > 0) {
        const envNames = failedEnvs.map((f) => f.environment).join(', ')
        toast.warning(
          formatMessage(m.idpProvidersPartialFailure, {
            environments: envNames,
          }),
        )
      }

      resetModalState()
    } else {
      toast.error(formatMessage(m.idpProvidersError))
    }
  }, [fetcher.data, formatMessage, resetModalState])

  const openCreateModal = () => {
    setIsEditing(false)
    setFormData(emptyForm)
    setSelectedEnvironments([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setModalVisible(true)
  }

  const openEditModal = async (idpProvider: IdpProviderRow) => {
    setIsEditing(true)
    setFormData({
      name: idpProvider.name,
      description: idpProvider.description,
      helptext: idpProvider.helptext,
      level: idpProvider.level,
    })
    setUserAvailableEnvironments([])
    setFormErrors({})
    setLoadingIdpProvider(true)
    setModalVisible(true)

    try {
      const result = await fetchIdpProvider({
        variables: { name: idpProvider.name },
      })
      const idpData = result.data?.authAdminIdpProvider
      const availableEnvironments = idpData?.availableEnvironments
      if (availableEnvironments) {
        setUserAvailableEnvironments(availableEnvironments)

        const bestEnv = pickBestEnvironment(
          selectedEnvResult.environment,
          availableEnvironments,
        )

        if (bestEnv) {
          updateEnvironment(bestEnv)
        }

        // Load form data from the selected environment
        const targetEnvData = idpData.environments?.find(
          (e) => e.environment === bestEnv,
        )
        if (targetEnvData) {
          setFormData((prev) => ({
            ...prev,
            description: targetEnvData.description,
            helptext: targetEnvData.helptext,
            level: targetEnvData.level,
          }))
        }
      }
    } catch {
      toast.error(formatMessage(m.idpProvidersError))
    } finally {
      setLoadingIdpProvider(false)
    }
  }

  const handleSubmit = async () => {
    const errors = validateIdpProviderForm({
      formData,
      isEditing,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing && !hasErrors(errors)) {
      try {
        const { data } = await fetchIdpProvider({
          variables: { name: formData.name },
        })
        if (data?.authAdminIdpProvider) {
          errors.name = formatMessage(m.idpProvidersErrorNameExists)
        }
      } catch {
        errors.name = formatMessage(m.idpProvidersErrorNameCheckFailed)
      }
    }

    setFormErrors(errors)

    if (hasErrors(errors)) {
      return
    }

    const intent = isEditing
      ? IdpProviderIntent.update
      : IdpProviderIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('name', formData.name)
    submitData.set('description', formData.description)
    submitData.set('helptext', formData.helptext)
    submitData.set('level', String(formData.level))

    if (!isEditing && selectedEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(selectedEnvironments))
    } else if (isEditing && userAvailableEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(userAvailableEnvironments))
    }

    fetcher.submit(submitData, { method: 'post' })
  }

  const handlePublish = async (targetEnvironment: AuthAdminEnvironment) => {
    if (formData.level === '') return
    try {
      await publishToEnvironment({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            helptext: formData.helptext,
            level: formData.level,
            environments: [targetEnvironment],
          },
        },
      })

      setUserAvailableEnvironments((prev) => [...prev, targetEnvironment])
      updateEnvironment(targetEnvironment)
      toast.success(
        formatMessage(m.idpProvidersPublishSuccess, {
          environment: targetEnvironment,
        }),
      )
    } catch {
      toast.error(formatMessage(m.idpProvidersError))
    }
  }

  const handleEnvironmentCheckboxChange = (env: AuthAdminEnvironment) => {
    setSelectedEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
    )
    if (formErrors.environments) {
      setFormErrors((prev) => ({ ...prev, environments: undefined }))
    }
  }

  const handleEnvironmentSwitch = (env: AuthAdminEnvironment) => {
    if (userAvailableEnvironments.includes(env)) {
      updateEnvironment(env)
    } else {
      handlePublish(env)
    }
  }

  const handleDelete = (name: string, environments: AuthAdminEnvironment[]) => {
    const submitData = new FormData()
    submitData.set('intent', IdpProviderIntent.delete)
    submitData.set('name', name)
    submitData.set('environments', JSON.stringify(environments))

    fetcher.submit(submitData, { method: 'post' })
  }

  const environmentOptions = useMemo(
    () =>
      authAdminEnvironments
        .filter((env) => configuredEnvironments.includes(env))
        .map((env) => {
          const isAvailable = userAvailableEnvironments.includes(env)
          return {
            label: isAvailable
              ? env
              : formatMessage(m.publishEnvironment, { environment: env }),
            value: env,
          }
        }),
    [userAvailableEnvironments, configuredEnvironments, formatMessage],
  )

  const setFormField = (
    field: keyof IdpProviderFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return {
    modalVisible,
    isEditing,
    formData,
    formErrors,
    selectedEnvironments,
    loadingIdpProvider,
    isSubmitting: fetcher.state !== 'idle',
    isPublishing,
    environmentOptions,
    selectedEnvResult,
    configuredEnvironments,
    openCreateModal,
    openEditModal,
    resetModalState,
    handleSubmit,
    handleDelete,
    handleEnvironmentCheckboxChange,
    handleEnvironmentSwitch,
    setFormField,
  }
}

export type IdpProviderModalState = ReturnType<typeof useIdpProviderModal>
