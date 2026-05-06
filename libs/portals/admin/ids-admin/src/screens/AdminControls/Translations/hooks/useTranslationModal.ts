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
  TranslationIntent,
  type TranslationsActionResult,
} from '../Translations.action'
import {
  GetTranslationDocument,
  type GetTranslationQuery,
  type GetTranslationQueryVariables,
  useCreateTranslationMutation,
} from '../Translations.generated'
import {
  emptyForm,
  type TranslationFormData,
  type TranslationRow,
  type FormErrors,
} from '../Translations.types'
import { validateTranslationForm, hasErrors } from '../Translations.utils'

interface UseTranslationModalParams {
  configuredEnvironments: AuthAdminEnvironment[]
  languageOptions: { label: string; value: string }[]
}

export const useTranslationModal = ({
  configuredEnvironments,
  languageOptions,
}: UseTranslationModalParams) => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<TranslationsActionResult>()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<TranslationFormData>(emptyForm)
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [userAvailableEnvironments, setUserAvailableEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const lastHandledFetcherData = useRef<TranslationsActionResult | null>(null)

  const [fetchTranslation] = useLazyQuery<
    GetTranslationQuery,
    GetTranslationQueryVariables
  >(GetTranslationDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateTranslationMutation()

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
        case TranslationIntent.create:
          toast.success(formatMessage(m.translationsCreateSuccess))
          break
        case TranslationIntent.update:
          toast.success(formatMessage(m.translationsUpdateSuccess))
          break
        case TranslationIntent.delete:
          toast.success(formatMessage(m.translationsDeleteSuccess))
          break
      }

      if (failedEnvs && failedEnvs.length > 0) {
        const envNames = failedEnvs.map((f) => f.environment).join(', ')
        toast.warning(
          formatMessage(m.translationsPartialFailure, {
            environments: envNames,
          }),
        )
      }

      resetModalState()
    } else {
      toast.error(
        fetcher.data.errorMessage ?? formatMessage(m.translationsError),
      )
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

  const openEditModal = async (translation: TranslationRow) => {
    setIsEditing(true)
    setFormData({
      language: translation.language,
      className: translation.className,
      property: translation.property,
      key: translation.key,
      value: translation.value ?? '',
    })
    setUserAvailableEnvironments([])
    setFormErrors({})
    setLoadingTranslation(true)
    setModalVisible(true)

    try {
      const result = await fetchTranslation({
        variables: {
          input: {
            language: translation.language,
            className: translation.className,
            property: translation.property,
            key: translation.key,
          },
        },
      })
      const data = result.data?.authAdminTranslation
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
            value: targetEnvData.value ?? '',
          }))
        }
      }
    } catch {
      toast.error(formatMessage(m.translationsError))
    } finally {
      setLoadingTranslation(false)
    }
  }

  const handleSubmit = async () => {
    const errors = validateTranslationForm({
      formData,
      isEditing,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing && !hasErrors(errors)) {
      try {
        const { data } = await fetchTranslation({
          variables: {
            input: {
              language: formData.language,
              className: formData.className,
              property: formData.property,
              key: formData.key,
            },
          },
        })
        if (data?.authAdminTranslation) {
          errors.key = formatMessage(m.translationsErrorAlreadyExists)
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
      toast.error(formatMessage(m.translationsError))
      return
    }

    const intent = isEditing
      ? TranslationIntent.update
      : TranslationIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('language', formData.language)
    submitData.set('className', formData.className)
    submitData.set('property', formData.property)
    submitData.set('key', formData.key)
    submitData.set('value', formData.value)

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
            language: formData.language,
            className: formData.className,
            property: formData.property,
            key: formData.key,
            value: formData.value,
            environments: [targetEnvironment],
          },
        },
      })

      setUserAvailableEnvironments((prev) => [...prev, targetEnvironment])
      updateEnvironment(targetEnvironment)
      toast.success(
        formatMessage(m.translationsPublishSuccess, {
          environment: targetEnvironment,
        }),
      )
    } catch {
      toast.error(formatMessage(m.translationsError))
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
    target: TranslationRow,
    environments: AuthAdminEnvironment[],
  ) => {
    const submitData = new FormData()
    submitData.set('intent', TranslationIntent.delete)
    submitData.set('language', target.language)
    submitData.set('className', target.className)
    submitData.set('property', target.property)
    submitData.set('key', target.key)
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

  const setFormField = (field: keyof TranslationFormData, value: string) => {
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
    loadingTranslation,
    isSubmitting: fetcher.state !== 'idle',
    isPublishing,
    environmentOptions,
    languageOptions,
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

export type TranslationModalState = ReturnType<typeof useTranslationModal>
