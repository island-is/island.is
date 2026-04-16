import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher, useLoaderData, useSearchParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { MultiValue } from 'react-select'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  FilterInput,
  Input,
  InputError,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'

import { m } from '../../lib/messages'
import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { authAdminEnvironments } from '../../utils/environments'
import type { ApiScopeUsersLoaderData } from './ApiScopeUsers.loader'
import {
  ApiScopeUserIntent,
  type ApiScopeUsersActionResult,
} from './ApiScopeUsers.action'
import {
  GetApiScopeUserDocument,
  type GetApiScopeUserQuery,
  type GetApiScopeUserQueryVariables,
  useCreateApiScopeUserMutation,
} from './ApiScopeUsers.generated'
import {
  emptyForm,
  type ApiScopeUserFormData,
  type ApiScopeUserRow,
  type FormErrors,
  type ScopeOption,
} from './ApiScopeUsers.types'
import {
  validateApiScopeUserForm,
  hasErrors,
  PAGE_SIZE,
} from './ApiScopeUsers.utils'
import { ApiScopeUsersTable } from './components/ApiScopeUsersTable'

const ApiScopeUsers = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as ApiScopeUsersLoaderData
  const fetcher = useFetcher<ApiScopeUsersActionResult>()
  const [searchParams, setSearchParams] = useSearchParams()

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
  const [loadingUser, setLoadingUser] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const lastHandledFetcherData = useRef<ApiScopeUsersActionResult | null>(null)

  const [fetchUser] = useLazyQuery<
    GetApiScopeUserQuery,
    GetApiScopeUserQueryVariables
  >(GetApiScopeUserDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateApiScopeUserMutation()

  const currentPage = Number(searchParams.get('page') ?? 1)
  const searchValue = searchParams.get('search') ?? ''
  const totalPages = Math.ceil((data?.users.totalCount ?? 0) / PAGE_SIZE)
  const accessControlledScopes = useMemo(
    () => data?.accessControlledScopes ?? [],
    [data?.accessControlledScopes],
  )
  const configuredEnvironments = useMemo(
    () => data?.configuredEnvironments ?? [],
    [data?.configuredEnvironments],
  )

  const environmentWrappers = useMemo(() => {
    const envs = configuredEnvironments.map((env) => ({ environment: env }))
    return envs.length > 0
      ? envs
      : [{ environment: AuthAdminEnvironment.Development }]
  }, [configuredEnvironments])
  const { environment: selectedEnvResult, updateEnvironment } =
    useEnvironmentQuery(environmentWrappers)

  const [localSearch, setLocalSearch] = useState(searchValue)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalSearch(searchValue)
  }, [searchValue])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const resetModalState = useCallback(() => {
    setModalVisible(false)
    setFormData(emptyForm)
    setActiveScopes([])
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
      resetModalState()
    } else {
      toast.error(formatMessage(m.apiScopeUsersError))
    }
  }, [fetcher.data, formatMessage, resetModalState])

  const commitSearch = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        if (value) {
          prev.set('search', value)
        } else {
          prev.delete('search')
        }
        prev.set('page', '1')
        return prev
      })
    },
    [setSearchParams],
  )

  // debouncing the filter so that the query isn't sent on every key press
  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        commitSearch(value)
      }, 500)
    },
    [commitSearch],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        prev.set('page', String(page))
        return prev
      })
    },
    [setSearchParams],
  )

  const openCreateModal = () => {
    setIsEditing(false)
    setFormData(emptyForm)
    setActiveScopes([])
    setSelectedEnvironments([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setModalVisible(true)
  }

  const openEditModal = async (user: ApiScopeUserRow) => {
    setIsEditing(true)
    setFormData({
      nationalId: user.nationalId,
      name: user.name ?? '',
      email: user.email,
    })
    setActiveScopes([])
    setUserAvailableEnvironments([])
    setFormErrors({})
    setLoadingUser(true)
    setModalVisible(true)

    try {
      const result = await fetchUser({
        variables: { nationalId: user.nationalId },
      })
      const userData = result.data?.authAdminApiScopeUser
      if (userData?.userAccess) {
        setActiveScopes(
          userData.userAccess.map(
            (access: { nationalId: string; scope: string }) => access.scope,
          ),
        )
      }
      if (userData?.availableEnvironments) {
        setUserAvailableEnvironments(userData.availableEnvironments)
      }
    } catch (e) {
      setModalVisible(false)
    } finally {
      setLoadingUser(false)
    }
  }

  const scopeOptions: ScopeOption[] = useMemo(
    () =>
      accessControlledScopes.map(
        (scope: {
          name: string
          displayName?: string | null
          description?: string | null
        }) => ({
          label: `${scope.displayName ?? scope.name} - ${scope.name}`,
          value: scope.name,
          description: scope.description ?? '',
        }),
      ),
    [accessControlledScopes],
  )

  const selectedScopeOptions = useMemo(
    () => scopeOptions.filter((opt) => activeScopes.includes(opt.value)),
    [scopeOptions, activeScopes],
  )

  const handleSubmit = async () => {
    const errors = validateApiScopeUserForm({
      formData,
      isEditing,
      selectedEnvironments,
      formatMessage,
    })

    if (!isEditing) {
      const { data } = await fetchUser({
        variables: { nationalId: formData.nationalId },
      })
      if (data?.authAdminApiScopeUser) {
        errors.nationalId = formatMessage(m.apiScopeUsersErrorNationalIdExists)
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

  const handleDelete = (nationalId: string) => {
    const submitData = new FormData()
    submitData.set('intent', ApiScopeUserIntent.delete)
    submitData.set('nationalId', nationalId)

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

  const isSubmitting = fetcher.state !== 'idle'

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.apiScopeUsers)}
        intro={formatMessage(m.apiScopeUsersDescription)}
      />

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        marginBottom={3}
        columnGap={2}
      >
        <Box flexGrow={1} style={{ maxWidth: 400 }}>
          <FilterInput
            placeholder={formatMessage(m.apiScopeUsersSearchPlaceholder)}
            name="api-scope-users-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={openCreateModal}>
          {formatMessage(m.apiScopeUsersCreateNew)}
        </Button>
      </Box>

      <ApiScopeUsersTable
        rows={data.users.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {modalVisible && (
        <Modal
          id="api-scope-user-modal"
          isVisible={modalVisible}
          label={
            isEditing
              ? formatMessage(m.apiScopeUsersEditTitle)
              : formatMessage(m.apiScopeUsersCreateTitle)
          }
          onClose={resetModalState}
          closeButtonLabel={formatMessage(m.apiScopeUsersCancelButton)}
          scrollType="outside"
        >
          <Box paddingX={4}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={4}
            >
              <Text variant="h2" as="h2">
                {isEditing
                  ? formatMessage(m.apiScopeUsersEditTitle)
                  : formatMessage(m.apiScopeUsersCreateTitle)}
              </Text>
              {isEditing && !loadingUser && (
                <Select
                  name="publishEnvironment"
                  label={formatMessage(m.environment)}
                  options={environmentOptions}
                  value={environmentOptions.find(
                    (opt) => opt.value === selectedEnvResult.environment,
                  )}
                  size="sm"
                  backgroundColor="blue"
                  isDisabled={isPublishing}
                  onChange={(opt) => {
                    if (!opt) return
                    const env = opt.value as AuthAdminEnvironment
                    if (userAvailableEnvironments.includes(env)) {
                      updateEnvironment(env)
                    } else {
                      handlePublish(env)
                    }
                  }}
                />
              )}
            </Box>

            <Box
              padding={4}
              border="standard"
              borderRadius="large"
              marginBottom={3}
            >
              <Stack space={3}>
                <Input
                  name="nationalId"
                  label={formatMessage(m.apiScopeUsersNationalId)}
                  value={formData.nationalId}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      nationalId: e.target.value,
                    }))
                    if (formErrors.nationalId) {
                      setFormErrors((prev) => ({
                        ...prev,
                        nationalId: undefined,
                      }))
                    }
                  }}
                  disabled={isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!formErrors.nationalId}
                  errorMessage={formErrors.nationalId}
                />
                <Input
                  name="name"
                  label={formatMessage(m.apiScopeUsersName)}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                    if (formErrors.name) {
                      setFormErrors((prev) => ({
                        ...prev,
                        name: undefined,
                      }))
                    }
                  }}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!formErrors.name}
                  errorMessage={formErrors.name}
                />
                <Input
                  name="email"
                  label={formatMessage(m.apiScopeUsersEmail)}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                    if (formErrors.email) {
                      setFormErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }))
                    }
                  }}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!formErrors.email}
                  errorMessage={formErrors.email}
                />

                {accessControlledScopes.length > 0 && (
                  <Box>
                    {loadingUser ? (
                      <Text>{formatMessage(m.apiScopeUsersScopesLoading)}</Text>
                    ) : (
                      <Select
                        label={formatMessage(m.apiScopeUsersScopes)}
                        value={selectedScopeOptions}
                        options={scopeOptions}
                        onChange={(value) => {
                          setActiveScopes(
                            (value as MultiValue<ScopeOption>).map(
                              (opt) => opt.value,
                            ),
                          )
                        }}
                        isMulti
                        size="sm"
                        backgroundColor="blue"
                      />
                    )}
                  </Box>
                )}

                {!isEditing && (
                  <Box marginTop={3}>
                    <Text variant="h4" marginBottom={2}>
                      {formatMessage(m.chooseEnvironment)}
                    </Text>
                    <Box
                      display="flex"
                      flexDirection={['column', 'row']}
                      columnGap={3}
                      rowGap={2}
                    >
                      {authAdminEnvironments.map((env) => (
                        <Box width="full" key={env}>
                          <Checkbox
                            label={env}
                            name="environments"
                            id={`environments.${env}`}
                            value={env}
                            checked={selectedEnvironments.includes(env)}
                            onChange={() =>
                              handleEnvironmentCheckboxChange(env)
                            }
                            disabled={!configuredEnvironments.includes(env)}
                            large
                          />
                        </Box>
                      ))}
                    </Box>
                    {formErrors.environments && (
                      <InputError
                        id="environments-error"
                        errorMessage={formErrors.environments}
                      />
                    )}
                  </Box>
                )}
                <Box
                  paddingTop={4}
                  display="flex"
                  justifyContent="spaceBetween"
                  columnGap={2}
                >
                  <Button variant="ghost" onClick={resetModalState}>
                    {formatMessage(m.apiScopeUsersCancelButton)}
                  </Button>
                  <Button onClick={handleSubmit} loading={isSubmitting}>
                    {isEditing
                      ? formatMessage(m.apiScopeUsersSaveButton)
                      : formatMessage(m.apiScopeUsersCreateButton)}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  )
}

export default ApiScopeUsers
