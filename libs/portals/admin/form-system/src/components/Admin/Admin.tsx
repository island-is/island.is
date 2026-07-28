import { useMutation } from '@apollo/client'
import {
  CREATE_ORGANIZATION_DELEGATION,
  DELETE_ORGANIZATION_DELEGATION,
} from '@island.is/form-system/graphql'
import { Box, Button, GridRow, Select, Text } from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { FormsContext } from '../../context/FormsContext'
import { OrganizationSelect } from '../OrganizationSelect'
import { Permissions } from './components/Permissions/Permissions'

type OpenIdConfiguration = {
  scopes_supported?: string[]
}

type ScopeOption = {
  label: string
  value: string
}

const getIssuerUrl = () => {
  const hostname = window.location.hostname

  if (hostname.includes('staging')) {
    return 'https://identity-server.staging01.devland.is'
  }

  if (hostname.includes('localhost') || hostname.includes('dev')) {
    return 'https://identity-server.dev01.devland.is'
  }

  return 'https://innskra.island.is'
}

const getScopeOptions = (delegations: string[]): ScopeOption[] =>
  delegations.map((delegation) => ({
    label: delegation,
    value: delegation,
  }))

export const Admin = () => {
  const {
    isAdmin,
    organizationNationalId,
    selectedDelegations,
    setSelectedDelegations,
  } = useContext(FormsContext)
  const { formatMessage } = useIntl()
  const [showScopes, setShowScopes] = useState(false)
  const [scopeOptions, setScopeOptions] = useState<ScopeOption[]>([])
  const [selectedScopes, setSelectedScopes] = useState<
    Array<ScopeOption | null>
  >(() => {
    const options = getScopeOptions(selectedDelegations)
    return options.length > 0 ? options : [null]
  })
  const [isLoadingScopes, setIsLoadingScopes] = useState(false)

  const [createDelegationMutation] = useMutation(CREATE_ORGANIZATION_DELEGATION)
  const [deleteDelegationMutation] = useMutation(DELETE_ORGANIZATION_DELEGATION)

  const openIdConfigurationUrl = useMemo(
    () => `${getIssuerUrl()}/.well-known/openid-configuration`,
    [],
  )

  const hasEmptyScopeDropdown = selectedScopes.some((scope) => !scope)

  useEffect(() => {
    const options = getScopeOptions(selectedDelegations)
    setSelectedScopes(options.length > 0 ? options : [null])
  }, [selectedDelegations])

  useEffect(() => {
    if (!showScopes || !hasEmptyScopeDropdown || scopeOptions.length > 0) {
      return
    }

    const fetchScopes = async () => {
      setIsLoadingScopes(true)

      try {
        const response = await fetch(openIdConfigurationUrl)
        const data = (await response.json()) as OpenIdConfiguration

        setScopeOptions(
          (data.scopes_supported ?? [])
            .filter((scope) => scope.startsWith('@'))
            .map((scope) => ({
              label: scope,
              value: scope,
            })),
        )
      } finally {
        setIsLoadingScopes(false)
      }
    }

    fetchScopes()
  }, [
    hasEmptyScopeDropdown,
    openIdConfigurationUrl,
    scopeOptions.length,
    showScopes,
  ])

  const deleteSelectedScope = async (index: number) => {
    const selectedScope = selectedScopes[index]

    if (!selectedScope) {
      const updatedSelectedScopes = selectedScopes.filter(
        (_, scopeIndex) => scopeIndex !== index,
      )

      setSelectedScopes(
        updatedSelectedScopes.length > 0 ? updatedSelectedScopes : [null],
      )
      return
    }

    try {
      await deleteDelegationMutation({
        variables: {
          input: {
            updateOrganizationDelegationDto: {
              delegation: selectedScope.value,
              organizationNationalId: organizationNationalId,
            },
          },
        },
      })

      setSelectedDelegations(
        selectedDelegations.filter(
          (delegation) => delegation !== selectedScope.value,
        ),
      )
    } catch (error) {
      throw new Error(`Failed to delete delegation: ${error}`)
    }
  }

  const updateSelectedScope = async (
    index: number,
    selected: ScopeOption | null,
  ) => {
    if (!selected) {
      return
    }

    try {
      await createDelegationMutation({
        variables: {
          input: {
            updateOrganizationDelegationDto: {
              delegation: selected.value,
              organizationNationalId: organizationNationalId,
            },
          },
        },
      })

      const updatedSelectedScopes = selectedScopes.map((scope, scopeIndex) =>
        scopeIndex === index ? selected : scope,
      )

      setSelectedScopes(updatedSelectedScopes)

      if (!selectedDelegations.includes(selected.value)) {
        setSelectedDelegations([...selectedDelegations, selected.value])
      }
    } catch (error) {
      throw new Error(`Failed to create delegation: ${error}`)
    }
  }

  return (
    <>
      <GridRow>
        <Box
          marginTop={4}
          marginBottom={3}
          marginRight={1}
          marginLeft={2}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <Box display="flex" flexDirection="column" width="full" rowGap={2}>
            <Box display="flex" justifyContent="flexEnd" width="full">
              {isAdmin && <OrganizationSelect />}
            </Box>

            {isAdmin && (
              <Box display="flex" alignItems="center" columnGap={3}>
                <Button
                  variant="utility"
                  colorScheme={!showScopes ? 'blueberry' : 'default'}
                  onClick={() => setShowScopes(false)}
                >
                  {formatMessage(m.permissions)}
                </Button>
                <Button
                  variant="utility"
                  colorScheme={showScopes ? 'blueberry' : 'default'}
                  onClick={() => setShowScopes(true)}
                >
                  Umboð
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </GridRow>
      {isAdmin &&
        (showScopes ? (
          <Box marginLeft={2} style={{ width: '40%' }}>
            <Box display="flex" flexDirection="column" rowGap={2}>
              {selectedScopes.map((selectedScope, index) =>
                selectedScope ? (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    columnGap={2}
                  >
                    <Button
                      variant="ghost"
                      colorScheme="destructive"
                      icon="trash"
                      size="small"
                      onClick={() => void deleteSelectedScope(index)}
                    />
                    <Text fontWeight="medium">{selectedScope.label}</Text>
                  </Box>
                ) : (
                  <Select
                    key={index}
                    name={`scopes-${index}`}
                    options={scopeOptions}
                    size="xs"
                    value={selectedScope}
                    placeholder={isLoadingScopes ? 'Sæki scopes...' : undefined}
                    onChange={(selected) =>
                      void updateSelectedScope(index, selected)
                    }
                  />
                ),
              )}

              <Box>
                <Button
                  preTextIcon="add"
                  onClick={() => {
                    if (hasEmptyScopeDropdown) {
                      return
                    }

                    setSelectedScopes([...selectedScopes, null])
                  }}
                >
                  Bæta við
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Permissions />
        ))}
    </>
  )
}
