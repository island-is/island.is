import { Box, Button, GridRow, Select, Text } from '@island.is/island-ui/core'
import { OrganizationSelect } from '../OrganizationSelect'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Permissions } from './components/Permissions/Permissions'

type OpenIdConfiguration = {
  scopes_supported?: string[]
}

type ScopeOption = {
  label: string
  value: string
}

const selectedScopesStorageKey = 'form-system-admin-selected-scopes'

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

const getStoredSelectedScopes = (): Array<ScopeOption | null> => {
  const selectedScopes = localStorage.getItem(selectedScopesStorageKey)

  if (!selectedScopes) {
    return [null]
  }

  return JSON.parse(selectedScopes).map((scope: string) => ({
    label: scope,
    value: scope,
  }))
}

export const Admin = () => {
  const { isAdmin } = useContext(FormsContext)
  const { formatMessage } = useIntl()
  const [showScopes, setShowScopes] = useState(false)
  const [scopeOptions, setScopeOptions] = useState<ScopeOption[]>([])
  const [selectedScopes, setSelectedScopes] = useState<
    Array<ScopeOption | null>
  >(getStoredSelectedScopes)
  const [isLoadingScopes, setIsLoadingScopes] = useState(false)

  const openIdConfigurationUrl = useMemo(
    () => `${getIssuerUrl()}/.well-known/openid-configuration`,
    [],
  )

  const hasEmptyScopeDropdown = selectedScopes.some((scope) => !scope)

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

  const deleteSelectedScope = (index: number) => {
    const updatedSelectedScopes = selectedScopes.filter(
      (_, scopeIndex) => scopeIndex !== index,
    )

    const nextSelectedScopes =
      updatedSelectedScopes.length > 0 ? updatedSelectedScopes : [null]

    setSelectedScopes(nextSelectedScopes)

    localStorage.setItem(
      selectedScopesStorageKey,
      JSON.stringify(
        nextSelectedScopes
          .filter((scope): scope is ScopeOption => Boolean(scope))
          .map((scope) => scope.value),
      ),
    )
  }

  const updateSelectedScope = (index: number, selected: ScopeOption | null) => {
    const updatedSelectedScopes = selectedScopes.map((scope, scopeIndex) =>
      scopeIndex === index ? selected : scope,
    )

    setSelectedScopes(updatedSelectedScopes)

    localStorage.setItem(
      selectedScopesStorageKey,
      JSON.stringify(
        updatedSelectedScopes
          .filter((scope): scope is ScopeOption => Boolean(scope))
          .map((scope) => scope.value),
      ),
    )
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
                <Button variant="text" onClick={() => setShowScopes(false)}>
                  {formatMessage(m.permissions)}
                </Button>
                <Button variant="text" onClick={() => setShowScopes(true)}>
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
                      variant="utility"
                      colorScheme="destructive"
                      icon="trash"
                      size="small"
                      onClick={() => deleteSelectedScope(index)}
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
                      updateSelectedScope(index, selected)
                    }
                  />
                ),
              )}

              <Box>
                <Button
                  variant="text"
                  onClick={() => setSelectedScopes([...selectedScopes, null])}
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
