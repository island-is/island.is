import React, { useCallback, useMemo, useState } from 'react'

import { Box, Button, Input, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { FormCard } from '../../../components/FormCard/FormCard'

interface AllowedCorsOriginsProps {
  allowedCorsOrigins: string[]
}

const AllowedCorsOrigins = ({
  allowedCorsOrigins,
}: AllowedCorsOriginsProps) => {
  const { formatMessage } = useLocale()
  const [origins, setOrigins] =
    useEnvironmentState<string[]>(allowedCorsOrigins)
  const [newOrigin, setNewOrigin] = useState('')
  const [inputError, setInputError] = useState('')

  const initialSet = useMemo(
    () => new Set(allowedCorsOrigins),
    [allowedCorsOrigins],
  )

  const validateOrigin = (origin: string): boolean => {
    try {
      const url = new URL(origin)
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return false
      }
      return true
    } catch {
      return false
    }
  }

  const handleAdd = () => {
    const trimmed = newOrigin.trim()
    if (!trimmed) return

    if (!validateOrigin(trimmed)) {
      setInputError(formatMessage(m.errorInvalidUrl))
      return
    }

    if (origins.includes(trimmed)) {
      setInputError(formatMessage(m.errorCorsOriginAlreadyExists))
      return
    }

    setOrigins((prev) => [...prev, trimmed])
    setNewOrigin('')
    setInputError('')
  }

  const handleRemove = (origin: string) => {
    setOrigins((prev) => prev.filter((o) => o !== origin))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const hasData = origins.length > 0

  const hasPendingInput = !!newOrigin.trim()

  const customValidation = useCallback(() => {
    if (origins.length !== initialSet.size) return true
    return origins.some((o) => !initialSet.has(o))
  }, [origins, initialSet])

  return (
    <FormCard
      title={formatMessage(m.allowedCorsOrigins)}
      description={formatMessage(m.corsDescription)}
      customValidation={customValidation}
      submitDisabled={hasPendingInput}
      intent={ClientFormTypes.corsOrigins}
      shouldSupportMultiEnvironment={false}
      headerMarginBottom={3}
    >
      <Box display="flex" columnGap={1} alignItems="flexStart" marginBottom={5}>
        <Box flexGrow={1}>
          <Input
            name="corsOriginInput"
            size="sm"
            label={formatMessage(m.cors)}
            placeholder={formatMessage(m.corsPlaceholder)}
            value={newOrigin}
            onChange={(e) => {
              setNewOrigin(e.target.value)
              if (inputError) setInputError('')
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (newOrigin.trim()) {
                setInputError(formatMessage(m.errorCorsOriginNotAdded))
              }
            }}
            backgroundColor="blue"
            errorMessage={inputError}
            hasError={!!inputError}
          />
        </Box>
        <Button
          variant="ghost"
          icon="add"
          onClick={handleAdd}
          disabled={newOrigin.length === 0}
        >
          {formatMessage(m.addCorsOrigin)}
        </Button>
      </Box>
      {hasData && (
        <Box style={{ maxHeight: 340 }}>
          <T.Table box={{ overflow: 'initial' }}>
            <T.Head sticky>
              <T.Row>
                <T.HeadData>{formatMessage(m.allowedCorsOrigins)}</T.HeadData>
                <T.HeadData>{/* For matching column count */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {origins.map((origin) => (
                <T.Row key={origin}>
                  <T.Data>
                    <Text variant="small">{origin}</Text>
                  </T.Data>
                  <T.Data>
                    <Box display="flex" justifyContent="flexEnd">
                      <Button
                        onClick={() => handleRemove(origin)}
                        aria-label={formatMessage(
                          m.permissionsButtonLabelRemove,
                        )}
                        icon="trash"
                        variant="ghost"
                        iconType="outline"
                        size="small"
                      />
                    </Box>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </Box>
      )}
      {origins.map((origin) => (
        <input
          key={origin}
          type="hidden"
          name="allowedCorsOrigins"
          value={origin}
        />
      ))}
    </FormCard>
  )
}

export default AllowedCorsOrigins
