import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { MultiValue } from 'react-select'

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
  ApiScopeUserIntent,
  type ApiScopeUsersActionResult,
} from '../ApiScopeUsers.action'
import {
  GetApiScopeUserDocument,
  GetAccessControlledScopesDocument,
  type GetApiScopeUserQuery,
  type GetApiScopeUserQueryVariables,
  type GetAccessControlledScopesQuery,
  type GetAccessControlledScopesQueryVariables,
  useCreateApiScopeUserMutation,
} from '../ApiScopeUsers.generated'
import {
  emptyForm,
  type ApiScopeUserFormData,
  type ApiScopeUserRow,
  type FormErrors,
  type ScopeOption,
} from '../ApiScopeUsers.types'
import { validateApiScopeUserForm, hasErrors } from '../ApiScopeUsers.utils'

interface EnvironmentUserData {
  environment: AuthAdminEnvironment
  name: string
  email: string
  scopes: string[]
}

const mapScopesToOptions = (
  scopes: Array<{
    name: string
    displayName?: string | null
    description?: string | null
  }>,
): ScopeOption[] =>
  scopes.map((scope) => ({
    label: `${scope.displayName ?? scope.name} - ${scope.name}`,
    value: scope.name,
    description: scope.description ?? '',
  }))

interface UseApiScopeUserModalParams {
  accessControlledScopes: Array<{
    name: string
    displayName?: string | null
    description?: string | null
  }>
  configuredEnvironments: AuthAdminEnvironment[]
}

export const useApiScopeUserModal = ({
  accessControlledScopes,
  configuredEnvironments,
}: UseApiScopeUserModalParams) => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<ApiScopeUsersActionResult>()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ApiScopeUserFormData>(emptyForm)
  const [activeScopes, setActiveScopes] = useState<string[]>([])
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [userAvailableEnvironments, setUserAvailableEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [originalHadName, setOriginalHadName] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const lastHandledFetcherData = useRef<ApiScopeUsersActionResult | null>(null)

  const [environmentsData, setEnvironmentsData] = useState<
    EnvironmentUserData[]
  >([])
  const [editEnvironment, setEditEnvironment] =
    useState<AuthAdminEnvironment | null>(null)
  const [editScopeOptions, setEditScopeOptions] = useState<
    ScopeOption[] | null
  >(null)
  const [loadingScopes, setLoadingScopes] = useState(false)
  const openEditRequestId = useRef(0)

  const [fetchUser] = useLazyQuery<
    GetApiScopeUserQuery,
    GetApiScopeUserQueryVariables
  >(GetApiScopeUserDocument, { fetchPolicy: 'network-only' })

  const [fetchScopes] = useLazyQuery<
    GetAccessControlledScopesQuery,
    GetAccessControlledScopesQueryVariables
  >(GetAccessControlledScopesDocument, { fetchPolicy: 'network-only' })

  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateApiScopeUserMutation()

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
    setActiveScopes([])
    setSelectedEnvironments([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setOriginalHadName(false)
    setEnvironmentsData([])
    setEditEnvironment(null)
    setEditScopeOptions(null)
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
        case ApiScopeUserIntent.create:
          toast.success(formatMessage(m.apiScopeUsersCreateSuccess))
          break
        case ApiScopeUserIntent.update:
          toast.success(formatMessage(m.apiScopeUsersUpdateSuccess))
          break
        case ApiScopeUserIntent.delete:
          toast.success(formatMessage(m.apiScopeUsersDeleteSuccess))
          break
      }

      if (failedEnvs && failedEnvs.length > 0) {
        const envNames = failedEnvs.map((f) => f.environment).join(', ')
        toast.warning(
          formatMessage(m.apiScopeUsersPartialFailure, {
            environments: envNames,
          }),
        )
      }

      resetModalState()
    } else {
      toast.error(formatMessage(m.apiScopeUsersError))
    }
  }, [fetcher.data, formatMessage, resetModalState])

  const openCreateModal = () => {
    setIsEditing(false)
    setFormData(emptyForm)
    setActiveScopes([])
    setSelectedEnvironments([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setOriginalHadName(false)
    setEnvironmentsData([])
    setEditEnvironment(null)
    setEditScopeOptions(null)
    setModalVisible(true)
  }

  const openEditModal = async (user: ApiScopeUserRow) => {
    const requestId = ++openEditRequestId.current

    setIsEditing(true)
    setOriginalHadName(!!user.name)
    setFormData({
      nationalId: user.nationalId,
      name: user.name ?? '',
      email: user.email,
    })
    setActiveScopes([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setEnvironmentsData([])
    setEditEnvironment(null)
    setEditScopeOptions(null)
    setLoadingUser(true)
    setModalVisible(true)

    try {
      const result = await fetchUser({
        variables: { nationalId: user.nationalId },
      })

      if (requestId !== openEditRequestId.current) return

      const userData = result.data?.authAdminApiScopeUser

      const envData: EnvironmentUserData[] = []
      if (userData?.environments) {
        for (const env of userData.environments) {
          envData.push({
            environment: env.environment,
            name: env.name ?? '',
            email: env.email,
            scopes: env.userAccess?.map((a) => a.scope) ?? [],
          })
        }
      }
      setEnvironmentsData(envData)

      if (userData?.availableEnvironments) {
        setUserAvailableEnvironments(userData.availableEnvironments)
      }

      if (envData.length > 0) {
        const available = envData.map((e) => e.environment)
        const bestEnv =
          pickBestEnvironment(selectedEnvResult.environment, available) ??
          available[0]

        const targetData =
          envData.find((e) => e.environment === bestEnv) ?? envData[0]
        setFormData({
          nationalId: user.nationalId,
          name: targetData.name,
          email: targetData.email,
        })
        setActiveScopes(targetData.scopes)
        setEditEnvironment(targetData.environment)
        updateEnvironment(targetData.environment)
      }

      const selectedEnv =
        envData.find((e) => e.environment === selectedEnvResult.environment)
          ?.environment ?? envData[0]?.environment
      if (selectedEnv) {
        setLoadingScopes(true)
        const scopesResult = await fetchScopes({
          variables: { environment: selectedEnv },
        })

        if (requestId !== openEditRequestId.current) return

        if (scopesResult.data?.authAdminAccessControlledScopes) {
          setEditScopeOptions(
            mapScopesToOptions(
              scopesResult.data.authAdminAccessControlledScopes,
            ),
          )
        }
        setLoadingScopes(false)
      }
    } catch {
      if (requestId !== openEditRequestId.current) return
      toast.error(formatMessage(m.apiScopeUsersError))
      setModalVisible(false)
    } finally {
      if (requestId === openEditRequestId.current) {
        setLoadingUser(false)
      }
    }
  }

  const scopeOptions: ScopeOption[] = useMemo(
    () => mapScopesToOptions(accessControlledScopes),
    [accessControlledScopes],
  )

  const activeScopeOptions =
    isEditing && editScopeOptions ? editScopeOptions : scopeOptions

  const selectedScopeOptions = useMemo(
    () => activeScopeOptions.filter((opt) => activeScopes.includes(opt.value)),
    [activeScopeOptions, activeScopes],
  )

  const handleSubmit = async () => {
    const errors = validateApiScopeUserForm({
      formData,
      isEditing,
      originalHadName,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing) {
      try {
        const { data } = await fetchUser({
          variables: { nationalId: formData.nationalId },
        })
        if (data?.authAdminApiScopeUser) {
          errors.nationalId = formatMessage(
            m.apiScopeUsersErrorNationalIdExists,
          )
        }
      } catch {
        errors.nationalId = formatMessage(
          m.apiScopeUsersErrorNationalIdCheckFailed,
        )
        setFormErrors(errors)
        return
      }
    }

    setFormErrors(errors)

    if (hasErrors(errors)) {
      return
    }

    const intent = isEditing
      ? ApiScopeUserIntent.update
      : ApiScopeUserIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('nationalId', formData.nationalId)
    submitData.set('name', formData.name)
    submitData.set('email', formData.email)
    submitData.set('userAccess', JSON.stringify(activeScopes))

    if (!isEditing && selectedEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(selectedEnvironments))
    } else if (isEditing && editEnvironment) {
      submitData.set('environments', JSON.stringify([editEnvironment]))
    }

    fetcher.submit(submitData, { method: 'post' })
  }

  const handlePublish = async (targetEnvironment: AuthAdminEnvironment) => {
    try {
      await publishToEnvironment({
        variables: {
          input: {
            nationalId: formData.nationalId,
            name: formData.name,
            email: formData.email,
            userAccess: activeScopes.map((scope) => ({
              nationalId: formData.nationalId,
              scope,
            })),
            environments: [targetEnvironment],
          },
        },
      })

      setUserAvailableEnvironments((prev) => [...prev, targetEnvironment])
      updateEnvironment(targetEnvironment)
      setEditEnvironment(targetEnvironment)

      setEnvironmentsData((prev) => [
        ...prev,
        {
          environment: targetEnvironment,
          name: formData.name,
          email: formData.email,
          scopes: [...activeScopes],
        },
      ])

      setLoadingScopes(true)
      try {
        const scopesResult = await fetchScopes({
          variables: { environment: targetEnvironment },
        })
        if (scopesResult.data?.authAdminAccessControlledScopes) {
          setEditScopeOptions(
            mapScopesToOptions(
              scopesResult.data.authAdminAccessControlledScopes,
            ),
          )
        }
      } catch {
        setEditScopeOptions(null)
      } finally {
        setLoadingScopes(false)
      }

      toast.success(
        formatMessage(m.apiScopeUsersPublishSuccess, {
          environment: targetEnvironment,
        }),
      )
    } catch {
      toast.error(formatMessage(m.apiScopeUsersError))
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

  const handleEnvironmentSwitch = async (env: AuthAdminEnvironment) => {
    if (userAvailableEnvironments.includes(env)) {
      setEditEnvironment(env)
      updateEnvironment(env)

      const envData = environmentsData.find((e) => e.environment === env)
      if (envData) {
        setFormData({
          nationalId: formData.nationalId,
          name: envData.name,
          email: envData.email,
        })
        setActiveScopes(envData.scopes)
      }

      setLoadingScopes(true)
      try {
        const scopesResult = await fetchScopes({
          variables: { environment: env },
        })
        if (scopesResult.data?.authAdminAccessControlledScopes) {
          setEditScopeOptions(
            mapScopesToOptions(
              scopesResult.data.authAdminAccessControlledScopes,
            ),
          )
        }
      } catch {
        setEditScopeOptions(null)
      } finally {
        setLoadingScopes(false)
      }
    } else {
      await handlePublish(env)
    }
  }

  const handleDelete = (
    nationalId: string,
    environments: AuthAdminEnvironment[],
  ) => {
    const submitData = new FormData()
    submitData.set('intent', ApiScopeUserIntent.delete)
    submitData.set('nationalId', nationalId)
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

  const setFormField = (field: keyof ApiScopeUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleScopeChange = (value: MultiValue<ScopeOption>) => {
    setActiveScopes(value.map((opt) => opt.value))
  }

  return {
    modalVisible,
    isEditing,
    formData,
    formErrors,
    selectedEnvironments,
    loadingUser,
    loadingScopes,
    isSubmitting: fetcher.state !== 'idle',
    isPublishing,
    activeScopeOptions,
    selectedScopeOptions,
    environmentOptions,
    editEnvironment,
    selectedEnvResult,
    configuredEnvironments,
    accessControlledScopes,
    openCreateModal,
    openEditModal,
    resetModalState,
    handleSubmit,
    handleDelete,
    handleEnvironmentCheckboxChange,
    handleEnvironmentSwitch,
    handleScopeChange,
    setFormField,
  }
}

export type ApiScopeUserModalState = ReturnType<typeof useApiScopeUserModal>
