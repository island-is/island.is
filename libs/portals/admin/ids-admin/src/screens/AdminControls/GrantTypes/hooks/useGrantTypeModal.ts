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
  GrantTypeIntent,
  type GrantTypesActionResult,
} from '../GrantTypes.action'
import {
  GetGrantTypeDocument,
  type GetGrantTypeQuery,
  type GetGrantTypeQueryVariables,
  useCreateGrantTypeMutation,
} from '../GrantTypes.generated'
import {
  emptyForm,
  type GrantTypeFormData,
  type GrantTypeRow,
  type FormErrors,
} from '../GrantTypes.types'
import { validateGrantTypeForm, hasErrors } from '../GrantTypes.utils'

interface UseGrantTypeModalParams {
  configuredEnvironments: AuthAdminEnvironment[]
}

export const useGrantTypeModal = ({
  configuredEnvironments,
}: UseGrantTypeModalParams) => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<GrantTypesActionResult>()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<GrantTypeFormData>(emptyForm)
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [userAvailableEnvironments, setUserAvailableEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [loadingGrantType, setLoadingGrantType] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [saveOnAllEnvs, setSaveOnAllEnvs] = useState(false)
  const lastHandledFetcherData = useRef<GrantTypesActionResult | null>(null)

  const [fetchGrantType] = useLazyQuery<
    GetGrantTypeQuery,
    GetGrantTypeQueryVariables
  >(GetGrantTypeDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateGrantTypeMutation()

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
    setSaveOnAllEnvs(false)
  }, [])

  const toggleSaveOnAllEnvs = useCallback(() => {
    setSaveOnAllEnvs((prev) => !prev)
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
        case GrantTypeIntent.create:
          toast.success(formatMessage(m.grantTypesCreateSuccess))
          break
        case GrantTypeIntent.update:
          toast.success(formatMessage(m.grantTypesUpdateSuccess))
          break
        case GrantTypeIntent.delete:
          toast.success(formatMessage(m.grantTypesDeleteSuccess))
          break
        case GrantTypeIntent.restore:
          toast.success(formatMessage(m.grantTypesRestoreSuccess))
          break
      }

      if (failedEnvs && failedEnvs.length > 0) {
        const envNames = failedEnvs.map((f) => f.environment).join(', ')
        toast.warning(
          formatMessage(m.grantTypesPartialFailure, {
            environments: envNames,
          }),
        )
      }

      resetModalState()
    } else {
      toast.error(formatMessage(m.grantTypesError))
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

  const openEditModal = async (grantType: GrantTypeRow) => {
    setIsEditing(true)
    setFormData({
      name: grantType.name,
      description: grantType.description,
    })
    setUserAvailableEnvironments([])
    setFormErrors({})
    setLoadingGrantType(true)
    setModalVisible(true)

    try {
      const result = await fetchGrantType({
        variables: { name: grantType.name },
      })
      const gtData = result.data?.authAdminGrantType
      const availableEnvironments = gtData?.availableEnvironments
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
        const targetEnvData = gtData.environments?.find(
          (e) => e.environment === bestEnv,
        )
        if (targetEnvData) {
          setFormData((prev) => ({
            ...prev,
            description: targetEnvData.description,
          }))
        }
      }
    } catch {
      toast.error(formatMessage(m.grantTypesError))
    } finally {
      setLoadingGrantType(false)
    }
  }

  const handleSubmit = async () => {
    const errors = validateGrantTypeForm({
      formData,
      isEditing,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing) {
      try {
        const { data } = await fetchGrantType({
          variables: { name: formData.name },
        })
        if (data?.authAdminGrantType) {
          errors.name = formatMessage(m.grantTypesErrorNameExists)
        }
      } catch {
        errors.name = formatMessage(m.grantTypesErrorNameCheckFailed)
        setFormErrors(errors)
        return
      }
    }

    setFormErrors(errors)

    if (hasErrors(errors)) {
      return
    }

    const intent = isEditing ? GrantTypeIntent.update : GrantTypeIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('name', formData.name)
    submitData.set('description', formData.description)

    if (!isEditing && selectedEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(selectedEnvironments))
    } else if (isEditing) {
      const targets =
        saveOnAllEnvs && userAvailableEnvironments.length > 1
          ? userAvailableEnvironments
          : [selectedEnvResult.environment]
      submitData.set('environments', JSON.stringify(targets))
    }

    fetcher.submit(submitData, { method: 'post' })
  }

  const handlePublish = async (targetEnvironment: AuthAdminEnvironment) => {
    try {
      await publishToEnvironment({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            environments: [targetEnvironment],
          },
        },
      })

      setUserAvailableEnvironments((prev) => [...prev, targetEnvironment])
      updateEnvironment(targetEnvironment)
      toast.success(
        formatMessage(m.grantTypesPublishSuccess, {
          environment: targetEnvironment,
        }),
      )
    } catch {
      toast.error(formatMessage(m.grantTypesError))
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
    submitData.set('intent', GrantTypeIntent.delete)
    submitData.set('name', name)
    submitData.set('environments', JSON.stringify(environments))

    fetcher.submit(submitData, { method: 'post' })
  }

  const handleRestore = (
    name: string,
    environments: AuthAdminEnvironment[],
  ) => {
    const submitData = new FormData()
    submitData.set('intent', GrantTypeIntent.restore)
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

  const setFormField = (field: keyof GrantTypeFormData, value: string) => {
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
    loadingGrantType,
    isSubmitting: fetcher.state !== 'idle',
    isPublishing,
    environmentOptions,
    selectedEnvResult,
    configuredEnvironments,
    userAvailableEnvironments,
    saveOnAllEnvs,
    openCreateModal,
    openEditModal,
    resetModalState,
    handleSubmit,
    handleDelete,
    handleRestore,
    handleEnvironmentCheckboxChange,
    handleEnvironmentSwitch,
    setFormField,
    toggleSaveOnAllEnvs,
  }
}

export type GrantTypeModalState = ReturnType<typeof useGrantTypeModal>
