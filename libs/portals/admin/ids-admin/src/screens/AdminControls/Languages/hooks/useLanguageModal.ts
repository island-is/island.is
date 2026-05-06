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
import { LanguageIntent, type LanguagesActionResult } from '../Languages.action'
import {
  GetLanguageDocument,
  type GetLanguageQuery,
  type GetLanguageQueryVariables,
  useCreateLanguageMutation,
} from '../Languages.generated'
import {
  emptyForm,
  type LanguageFormData,
  type LanguageRow,
  type FormErrors,
} from '../Languages.types'
import { validateLanguageForm, hasErrors } from '../Languages.utils'

interface UseLanguageModalParams {
  configuredEnvironments: AuthAdminEnvironment[]
}

export const useLanguageModal = ({
  configuredEnvironments,
}: UseLanguageModalParams) => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<LanguagesActionResult>()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<LanguageFormData>(emptyForm)
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [userAvailableEnvironments, setUserAvailableEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [loadingLanguage, setLoadingLanguage] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const lastHandledFetcherData = useRef<LanguagesActionResult | null>(null)

  const [fetchLanguage] = useLazyQuery<
    GetLanguageQuery,
    GetLanguageQueryVariables
  >(GetLanguageDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateLanguageMutation()

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
        case LanguageIntent.create:
          toast.success(formatMessage(m.languagesCreateSuccess))
          break
        case LanguageIntent.update:
          toast.success(formatMessage(m.languagesUpdateSuccess))
          break
        case LanguageIntent.delete:
          toast.success(formatMessage(m.languagesDeleteSuccess))
          break
      }

      if (failedEnvs && failedEnvs.length > 0) {
        const envNames = failedEnvs.map((f) => f.environment).join(', ')
        toast.warning(
          formatMessage(m.languagesPartialFailure, {
            environments: envNames,
          }),
        )
      }

      resetModalState()
    } else {
      toast.error(fetcher.data.errorMessage ?? formatMessage(m.languagesError))
    }
  }, [fetcher.data, formatMessage, resetModalState])

  const openCreateModal = () => {
    resetModalState()
    setIsEditing(false)
    setModalVisible(true)
  }

  const openEditModal = async (language: LanguageRow) => {
    setIsEditing(true)
    setFormData({
      isoKey: language.isoKey,
      description: language.description,
      englishDescription: language.englishDescription,
    })
    setUserAvailableEnvironments([])
    setFormErrors({})
    setLoadingLanguage(true)
    setModalVisible(true)

    try {
      const result = await fetchLanguage({
        variables: { isoKey: language.isoKey },
      })
      const data = result.data?.authAdminLanguage
      const availableEnvironments = data?.availableEnvironments
      if (availableEnvironments) {
        setUserAvailableEnvironments(availableEnvironments)

        const bestEnv = pickBestEnvironment(
          selectedEnvResult.environment,
          availableEnvironments,
        )

        if (bestEnv) {
          updateEnvironment(bestEnv)
        }

        const targetEnvData = data?.environments?.find(
          (e) => e.environment === bestEnv,
        )
        if (targetEnvData) {
          setFormData((prev) => ({
            ...prev,
            description: targetEnvData.description,
            englishDescription: targetEnvData.englishDescription,
          }))
        }
      }
    } catch {
      toast.error(formatMessage(m.languagesError))
    } finally {
      setLoadingLanguage(false)
    }
  }

  const handleSubmit = async () => {
    const errors = validateLanguageForm({
      formData,
      isEditing,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing && !hasErrors(errors)) {
      try {
        const { data } = await fetchLanguage({
          variables: { isoKey: formData.isoKey },
        })
        if (data?.authAdminLanguage) {
          errors.isoKey = formatMessage(m.languagesErrorAlreadyExists)
        }
      } catch {
        // If the lookup fails we continue with create — backend will reject duplicates.
      }
    }

    setFormErrors(errors)

    if (hasErrors(errors)) {
      return
    }

    if (isEditing && userAvailableEnvironments.length === 0) {
      toast.error(formatMessage(m.languagesError))
      return
    }

    const intent = isEditing ? LanguageIntent.update : LanguageIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('isoKey', formData.isoKey)
    submitData.set('description', formData.description)
    submitData.set('englishDescription', formData.englishDescription)

    if (!isEditing && selectedEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(selectedEnvironments))
    } else if (isEditing && userAvailableEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(userAvailableEnvironments))
    }

    fetcher.submit(submitData, { method: 'post' })
  }

  const handlePublish = async (targetEnvironment: AuthAdminEnvironment) => {
    try {
      await publishToEnvironment({
        variables: {
          input: {
            isoKey: formData.isoKey,
            description: formData.description,
            englishDescription: formData.englishDescription,
            environments: [targetEnvironment],
          },
        },
      })

      setUserAvailableEnvironments((prev) => [...prev, targetEnvironment])
      updateEnvironment(targetEnvironment)
      toast.success(
        formatMessage(m.languagesPublishSuccess, {
          environment: targetEnvironment,
        }),
      )
    } catch {
      toast.error(formatMessage(m.languagesError))
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

  const handleDelete = (
    isoKey: string,
    environments: AuthAdminEnvironment[],
  ) => {
    const submitData = new FormData()
    submitData.set('intent', LanguageIntent.delete)
    submitData.set('isoKey', isoKey)
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

  const setFormField = (field: keyof LanguageFormData, value: string) => {
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
    loadingLanguage,
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

export type LanguageModalState = ReturnType<typeof useLanguageModal>
