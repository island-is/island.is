import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher, useLoaderData, useSearchParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { MultiValue } from 'react-select'

import {
  Box,
  Button,
  DialogPrompt,
  FilterInput,
  Input,
  Pagination,
  Select,
  Stack,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'

import { m } from '../../lib/messages'
import type { ApiScopeUsersLoaderData } from './ApiScopeUsers.loader'
import {
  ApiScopeUserIntent,
  type ApiScopeUsersActionResult,
} from './ApiScopeUsers.action'
import {
  GetApiScopeUserDocument,
  type GetApiScopeUserQuery,
  type GetApiScopeUserQueryVariables,
} from './ApiScopeUsers.generated'
import { Problem } from '@island.is/react-spa/shared'

interface ApiScopeUserRow {
  nationalId: string
  name?: string | null
  email: string
}

const PAGE_SIZE = 20

interface ApiScopeUserFormData {
  nationalId: string
  name: string
  email: string
}

const emptyForm: ApiScopeUserFormData = {
  nationalId: '',
  name: '',
  email: '',
}

const ApiScopeUsers = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as ApiScopeUsersLoaderData
  const fetcher = useFetcher<ApiScopeUsersActionResult>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ApiScopeUserFormData>(emptyForm)
  const [activeScopes, setActiveScopes] = useState<string[]>([])
  const [loadingUser, setLoadingUser] = useState(false)
  const lastHandledFetcherData = useRef<ApiScopeUsersActionResult | null>(null)

  const [fetchUser] = useLazyQuery<
    GetApiScopeUserQuery,
    GetApiScopeUserQueryVariables
  >(GetApiScopeUserDocument, { fetchPolicy: 'network-only' })

  const currentPage = Number(searchParams.get('page') ?? 1)
  const searchValue = searchParams.get('search') ?? ''
  const totalPages = Math.ceil((data?.users.totalCount ?? 0) / PAGE_SIZE)
  const accessControlledScopes = useMemo(
    () => data?.accessControlledScopes ?? [],
    [data?.accessControlledScopes],
  )

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

  useEffect(() => {
    // only handle the fetcher data if it's different from the last handled fetcher data
    // to avoid a loop of re-rendering the component
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
      setModalVisible(false)
      setFormData(emptyForm)
      setActiveScopes([])
    } else {
      toast.error(formatMessage(m.apiScopeUsersError))
    }
  }, [fetcher.data, formatMessage])

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
    setLoadingUser(true)
    setModalVisible(true)

    const result = await fetchUser({
      variables: { nationalId: user.nationalId },
    })
    if (result.data?.authAdminApiScopeUser?.userAccess) {
      setActiveScopes(
        result.data.authAdminApiScopeUser.userAccess.map(
          (access: { nationalId: string; scope: string }) => access.scope,
        ),
      )
    }
    setLoadingUser(false)
  }

  type ScopeOption = { label: string; value: string; description?: string }

  const scopeOptions: ScopeOption[] = useMemo(
    () =>
      accessControlledScopes.map(
        (scope: {
          name: string
          displayName?: string | null
          description?: string | null
        }) => ({
          label: `${scope.displayName ?? scope.name} (${scope.name})`,
          value: scope.name,
          description: `${scope.name}${scope.description ? ' - ' : ''}${
            scope.description ?? ''
          }`,
        }),
      ),
    [accessControlledScopes],
  )

  const selectedScopeOptions = useMemo(
    () => scopeOptions.filter((opt) => activeScopes.includes(opt.value)),
    [scopeOptions, activeScopes],
  )

  const handleSubmit = () => {
    const intent = isEditing
      ? ApiScopeUserIntent.update
      : ApiScopeUserIntent.create

    const submitData = new FormData()
    submitData.set('intent', intent)
    submitData.set('nationalId', formData.nationalId)
    submitData.set('name', formData.name)
    submitData.set('email', formData.email)
    submitData.set('userAccess', JSON.stringify(activeScopes))

    fetcher.submit(submitData, { method: 'post' })
  }

  const handleDelete = (nationalId: string) => {
    const submitData = new FormData()
    submitData.set('intent', ApiScopeUserIntent.delete)
    submitData.set('nationalId', nationalId)

    fetcher.submit(submitData, { method: 'post' })
  }

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
        <Button size="small" icon="add" onClick={openCreateModal}>
          {formatMessage(m.apiScopeUsersCreateNew)}
        </Button>
      </Box>

      {data.users.rows.length === 0 ? (
        <Box
          padding={4}
          textAlign="center"
          border="standard"
          borderRadius="large"
        >
          <Problem
            type="no_data"
            title={formatMessage(m.apiScopeUsersNoResults)}
            titleSize="h3"
          />
        </Box>
      ) : (
        <Stack space={3}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.apiScopeUsersName)}</T.HeadData>
                <T.HeadData>
                  {formatMessage(m.apiScopeUsersNationalId)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.apiScopeUsersEmail)}</T.HeadData>
                <T.HeadData>{/* Actions */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data.users.rows.map((user: ApiScopeUserRow) => (
                <T.Row key={user.nationalId}>
                  <T.Data>{user.name}</T.Data>
                  <T.Data>{user.nationalId}</T.Data>
                  <T.Data>{user.email}</T.Data>
                  <T.Data>
                    <Box display="flex" columnGap={2} justifyContent="flexEnd">
                      <Button
                        variant="ghost"
                        size="small"
                        icon="pencil"
                        onClick={() => openEditModal(user)}
                      />
                      <DialogPrompt
                        baseId={`delete-${user.nationalId}`}
                        title={formatMessage(m.apiScopeUsersDeleteConfirmTitle)}
                        description={formatMessage(
                          m.apiScopeUsersDeleteConfirmMessage,
                        )}
                        ariaLabel={formatMessage(
                          m.apiScopeUsersDeleteConfirmTitle,
                        )}
                        buttonTextConfirm={formatMessage(
                          m.apiScopeUsersDeleteButton,
                        )}
                        buttonTextCancel={formatMessage(
                          m.apiScopeUsersCancelButton,
                        )}
                        onConfirm={() => handleDelete(user.nationalId)}
                        disclosureElement={
                          <Button
                            variant="ghost"
                            size="small"
                            icon="trash"
                            colorScheme="destructive"
                          />
                        }
                      />
                    </Box>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button
                    className={className}
                    onClick={() => handlePageChange(page)}
                  >
                    {children}
                  </button>
                )}
              />
            </Box>
          )}
        </Stack>
      )}

      {modalVisible && (
        <Modal
          id="api-scope-user-modal"
          isVisible={modalVisible}
          label={
            isEditing
              ? formatMessage(m.apiScopeUsersEditTitle)
              : formatMessage(m.apiScopeUsersCreateTitle)
          }
          title={
            isEditing
              ? formatMessage(m.apiScopeUsersEditTitle)
              : formatMessage(m.apiScopeUsersCreateTitle)
          }
          onClose={() => {
            setModalVisible(false)
            setFormData(emptyForm)
            setActiveScopes([])
          }}
          closeButtonLabel={formatMessage(m.apiScopeUsersCancelButton)}
          scrollType="outside"
        >
          <Box paddingTop={4}>
            <Stack space={3}>
              <Input
                name="nationalId"
                label={formatMessage(m.apiScopeUsersNationalId)}
                value={formData.nationalId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nationalId: e.target.value,
                  }))
                }
                disabled={isEditing}
                size="sm"
                backgroundColor="blue"
              />
              <Input
                name="name"
                label={formatMessage(m.apiScopeUsersName)}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                size="sm"
                backgroundColor="blue"
              />
              <Input
                name="email"
                label={formatMessage(m.apiScopeUsersEmail)}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                size="sm"
                backgroundColor="blue"
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
                      placeholder={formatMessage(m.apiScopeUsersScopes)}
                      isMulti
                      size="sm"
                      backgroundColor="blue"
                    />
                  )}
                </Box>
              )}

              <Box display="flex" justifyContent="flexEnd" columnGap={2}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setModalVisible(false)
                    setFormData(emptyForm)
                    setActiveScopes([])
                  }}
                >
                  {formatMessage(m.apiScopeUsersCancelButton)}
                </Button>
                <Button onClick={handleSubmit} loading={isSubmitting}>
                  {formatMessage(m.apiScopeUsersSaveButton)}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Modal>
      )}
    </Box>
  )
}

export default ApiScopeUsers
