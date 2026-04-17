import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher, useLoaderData, useSearchParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  FilterInput,
  Input,
  InputError,
  Select,
  SkeletonLoader,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'

import { m } from '../../../lib/messages'
import { useEnvironmentQuery } from '../../../hooks/useEnvironmentQuery'
import { authAdminEnvironments } from '../../../utils/environments'
import type { GrantTypesLoaderData } from './GrantTypes.loader'
import {
  GrantTypeIntent,
  type GrantTypesActionResult,
} from './GrantTypes.action'
import {
  GetGrantTypeDocument,
  type GetGrantTypeQuery,
  type GetGrantTypeQueryVariables,
  useCreateGrantTypeMutation,
} from './GrantTypes.generated'
import {
  emptyForm,
  type GrantTypeFormData,
  type GrantTypeRow,
  type FormErrors,
} from './GrantTypes.types'
import {
  validateGrantTypeForm,
  hasErrors,
  PAGE_SIZE,
} from './GrantTypes.utils'
import { GrantTypesTable } from './components/GrantTypesTable'

const GrantTypes = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as GrantTypesLoaderData
  const fetcher = useFetcher<GrantTypesActionResult>()
  const [searchParams, setSearchParams] = useSearchParams()

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
  const lastHandledFetcherData = useRef<GrantTypesActionResult | null>(null)

  const [fetchGrantType] = useLazyQuery<
    GetGrantTypeQuery,
    GetGrantTypeQueryVariables
  >(GetGrantTypeDocument, { fetchPolicy: 'network-only' })
  const [publishToEnvironment, { loading: isPublishing }] =
    useCreateGrantTypeMutation()

  const currentPage = Number(searchParams.get('page') ?? 1)
  const searchValue = searchParams.get('search') ?? ''
  const totalPages = Math.ceil(
    (data?.grantTypes.totalCount ?? 0) / PAGE_SIZE,
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
        case GrantTypeIntent.create:
          toast.success(formatMessage(m.grantTypesCreateSuccess))
          break
        case GrantTypeIntent.update:
          toast.success(formatMessage(m.grantTypesUpdateSuccess))
          break
        case GrantTypeIntent.delete:
          toast.success(formatMessage(m.grantTypesDeleteSuccess))
          break
      }
      resetModalState()
    } else {
      toast.error(formatMessage(m.grantTypesError))
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
      if (gtData?.availableEnvironments) {
        setUserAvailableEnvironments(gtData.availableEnvironments)
      }
    } catch {
      setModalVisible(false)
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

    const intent = isEditing
      ? GrantTypeIntent.update
      : GrantTypeIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('name', formData.name)
    submitData.set('description', formData.description)

    if (!isEditing && selectedEnvironments.length > 0) {
      submitData.set('environments', JSON.stringify(selectedEnvironments))
    } else if (isEditing && userAvailableEnvironments.length > 0) {
      submitData.set(
        'environments',
        JSON.stringify(userAvailableEnvironments),
      )
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

  const handleDelete = (name: string) => {
    const submitData = new FormData()
    submitData.set('intent', GrantTypeIntent.delete)
    submitData.set('name', name)

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
        title={formatMessage(m.grantTypes)}
        intro={formatMessage(m.grantTypesIntro)}
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
            placeholder={formatMessage(m.grantTypesSearchPlaceholder)}
            name="grant-types-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={openCreateModal}>
          {formatMessage(m.grantTypesCreateNew)}
        </Button>
      </Box>

      <GrantTypesTable
        rows={data.grantTypes.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {modalVisible && (
        <Modal
          id="grant-type-modal"
          isVisible={modalVisible}
          label={
            isEditing
              ? formatMessage(m.grantTypesEditTitle)
              : formatMessage(m.grantTypesCreateTitle)
          }
          onClose={resetModalState}
          closeButtonLabel={formatMessage(m.grantTypesCancelButton)}
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
                  ? formatMessage(m.grantTypesEditTitle)
                  : formatMessage(m.grantTypesCreateTitle)}
              </Text>
              {isEditing &&
                (loadingGrantType ? (
                  <Box style={{ minWidth: 200 }}>
                    <SkeletonLoader height={40} borderRadius="large" />
                  </Box>
                ) : (
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
                ))}
            </Box>

            <Box marginBottom={3}>
              <Stack space={3}>
                <Input
                  name="name"
                  label={formatMessage(m.grantTypesName)}
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
                  disabled={isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!formErrors.name}
                  errorMessage={formErrors.name}
                />
                <Input
                  name="description"
                  label={formatMessage(m.grantTypesDescription)}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                    if (formErrors.description) {
                      setFormErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }))
                    }
                  }}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!formErrors.description}
                  errorMessage={formErrors.description}
                />

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
                    {formatMessage(m.grantTypesCancelButton)}
                  </Button>
                  <Button onClick={handleSubmit} loading={isSubmitting}>
                    {isEditing
                      ? formatMessage(m.grantTypesSaveButton)
                      : formatMessage(m.grantTypesCreateButton)}
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

export default GrantTypes
