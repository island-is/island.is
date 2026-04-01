import React, { useCallback, useEffect, useState } from 'react'

import { Box, Button, Input, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { ShadowBox } from '../../../components/ShadowBox/ShadowBox'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useClient } from '../ClientContext'
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
  const [addedOrigins, setAddedOrigins] = useState<string[]>([])
  const [removedOrigins, setRemovedOrigins] = useState<string[]>([])
  const { actionData } = useClient()

  useEffect(() => {
    if (
      actionData?.intent === ClientFormTypes.corsOrigins &&
      actionData?.data
    ) {
      setAddedOrigins([])
      setRemovedOrigins([])
    }
  }, [actionData])

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
      setInputError(formatMessage(m.errorDefault))
      return
    }

    setOrigins((prev) => [...prev, trimmed])
    setAddedOrigins((prev) => [...prev, trimmed])
    setRemovedOrigins((prev) => prev.filter((o) => o !== trimmed))
    setNewOrigin('')
    setInputError('')
  }

  const handleRemove = (origin: string) => {
    setOrigins((prev) => prev.filter((o) => o !== origin))
    setAddedOrigins((prev) => prev.filter((o) => o !== origin))

    if (!addedOrigins.includes(origin)) {
      setRemovedOrigins((prev) => [...prev, origin])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const hasData = origins.length > 0

  const customValidation = useCallback(
    () => addedOrigins.length > 0 || removedOrigins.length > 0,
    [addedOrigins, removedOrigins],
  )

  return (
    <FormCard
      title={formatMessage(m.allowedCorsOrigins)}
      description={formatMessage(m.corsDescription)}
      customValidation={customValidation}
      intent={ClientFormTypes.corsOrigins}
      shouldSupportMultiEnvironment={false}
      headerMarginBottom={3}
    >
      <Box display="flex" columnGap={2} alignItems="flexStart" marginBottom={3}>
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
            backgroundColor="blue"
            errorMessage={inputError}
            hasError={!!inputError}
            buttons={[
              {
                label: formatMessage(m.add),
                name: 'add',
                type: 'outline',
                onClick: handleAdd,
              },
            ]}
          />
        </Box>
      </Box>
      {hasData && (
        <ShadowBox style={{ maxHeight: 340 }}>
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
        </ShadowBox>
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
