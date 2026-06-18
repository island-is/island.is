import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { GrantTypeRow } from '../GrantTypes.types'

const activeEnvsFor = (target: GrantTypeRow): AuthAdminEnvironment[] => {
  const archived = target.archivedEnvironments ?? []
  return (target.availableEnvironments ?? []).filter(
    (e) => !archived.includes(e),
  )
}

const variantConfig = {
  delete: {
    title: m.grantTypesDeleteConfirmTitle,
    message: m.grantTypesDeleteConfirmMessage,
    environmentLabel: m.grantTypesDeleteSelectEnvironments,
    environmentError: m.grantTypesDeleteEnvironmentRequired,
    confirmLabel: m.archive,
    confirmColorScheme: 'destructive' as const,
    eligibleEnvsFor: activeEnvsFor,
    ineligibleEnvsFor: (target: GrantTypeRow) =>
      target.archivedEnvironments ?? [],
    disabledTagMessage: m.grantTypesAlreadyArchivedTag,
    disabledTagVariant: 'red' as const,
  },
  restore: {
    title: m.grantTypesRestoreConfirmTitle,
    message: m.grantTypesRestoreConfirmMessage,
    environmentLabel: m.grantTypesRestoreSelectEnvironments,
    environmentError: m.grantTypesRestoreEnvironmentRequired,
    confirmLabel: m.restore,
    confirmColorScheme: 'default' as const,
    eligibleEnvsFor: (target: GrantTypeRow) =>
      target.archivedEnvironments ?? [],
    ineligibleEnvsFor: activeEnvsFor,
    disabledTagMessage: m.grantTypesAlreadyActiveTag,
    disabledTagVariant: 'blue' as const,
  },
}

interface GrantTypeConfirmModalProps {
  variant: 'delete' | 'restore'
  target: GrantTypeRow
  configuredEnvironments: AuthAdminEnvironment[]
  onConfirm: (name: string, environments: AuthAdminEnvironment[]) => void
  onClose: () => void
}

export const GrantTypeConfirmModal = ({
  variant,
  target,
  configuredEnvironments,
  onConfirm,
  onClose,
}: GrantTypeConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const config = variantConfig[variant]

  const eligibleEnvironments = config.eligibleEnvsFor(target)
  const ineligibleEnvironments = config.ineligibleEnvsFor(target)

  // Only seed envs that are both eligible (in the target's state) AND
  // configured for this client. Otherwise a disabled-but-checked env could
  // be submitted, asking the backend to act on an env we can't reach.
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >(eligibleEnvironments.filter((e) => configuredEnvironments.includes(e)))
  const [error, setError] = useState<string | undefined>(undefined)

  const handleEnvironmentChange = (env: AuthAdminEnvironment) => {
    setSelectedEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
    )
    if (error) {
      setError(undefined)
    }
  }

  const handleConfirm = () => {
    if (selectedEnvironments.length === 0) {
      setError(formatMessage(config.environmentError))
      return
    }
    onConfirm(target.name, selectedEnvironments)
  }

  return (
    <Modal
      id={`${variant}-${target.name}`}
      isVisible
      label={formatMessage(config.title)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.cancel)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Text variant="h2" as="h2" marginBottom={2}>
          {formatMessage(config.title)}
        </Text>
        <Text marginBottom={3}>{formatMessage(config.message)}</Text>

        <Box marginBottom={3}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(config.environmentLabel)}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            columnGap={3}
            rowGap={2}
          >
            {authAdminEnvironments.map((env) => {
              const isEligible = eligibleEnvironments.includes(env)
              const isInOtherState = ineligibleEnvironments.includes(env)
              return (
                <Box width="full" key={env}>
                  <Checkbox
                    label={
                      <Box
                        display="flex"
                        alignItems="center"
                        columnGap={1}
                        component="span"
                      >
                        <span>{env}</span>
                        {isInOtherState && (
                          <span>
                            ({formatMessage(config.disabledTagMessage)})
                          </span>
                        )}
                      </Box>
                    }
                    name={`${variant}Environments`}
                    id={`${variant}Environments.${env}`}
                    value={env}
                    checked={selectedEnvironments.includes(env)}
                    onChange={() => handleEnvironmentChange(env)}
                    disabled={
                      !isEligible || !configuredEnvironments.includes(env)
                    }
                    large
                  />
                </Box>
              )
            })}
          </Box>
          {error && (
            <InputError
              id={`${variant}-environments-error`}
              errorMessage={error}
            />
          )}
        </Box>

        <Box
          paddingTop={2}
          paddingBottom={4}
          display="flex"
          justifyContent="spaceBetween"
          columnGap={2}
        >
          <Button variant="ghost" onClick={onClose}>
            {formatMessage(m.cancel)}
          </Button>
          <Button
            colorScheme={config.confirmColorScheme}
            onClick={handleConfirm}
          >
            {formatMessage(config.confirmLabel)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
