import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  InputError,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { UserIdentityRow } from '../UserIdentities.types'

const variantConfig = {
  deactivate: {
    title: m.userIdentitiesDeactivateConfirmTitle,
    message: m.userIdentitiesDeactivateConfirmMessage,
    environmentLabel: m.userIdentitiesDeactivateSelectEnvironments,
    environmentError: m.userIdentitiesDeactivateEnvironmentRequired,
    confirmLabel: m.userIdentitiesDeactivate,
    confirmColorScheme: 'destructive' as const,
    eligibleEnvironmentsKey: 'activeEnvironments' as const,
    ineligibleEnvironmentsKey: 'deactivatedEnvironments' as const,
    disabledTagMessage: m.userIdentitiesAlreadyDeactivatedTag,
    disabledTagVariant: 'red' as const,
  },
  reactivate: {
    title: m.userIdentitiesReactivateConfirmTitle,
    message: m.userIdentitiesReactivateConfirmMessage,
    environmentLabel: m.userIdentitiesReactivateSelectEnvironments,
    environmentError: m.userIdentitiesReactivateEnvironmentRequired,
    confirmLabel: m.userIdentitiesReactivate,
    confirmColorScheme: 'default' as const,
    eligibleEnvironmentsKey: 'deactivatedEnvironments' as const,
    ineligibleEnvironmentsKey: 'activeEnvironments' as const,
    disabledTagMessage: m.userIdentitiesAlreadyActiveTag,
    disabledTagVariant: 'blue' as const,
  },
}

interface UserIdentityConfirmModalProps {
  variant: 'deactivate' | 'reactivate'
  target: UserIdentityRow
  configuredEnvironments: AuthAdminEnvironment[]
  onConfirm: (subjectId: string, environments: AuthAdminEnvironment[]) => void
  onClose: () => void
}

export const UserIdentityConfirmModal = ({
  variant,
  target,
  configuredEnvironments,
  onConfirm,
  onClose,
}: UserIdentityConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const config = variantConfig[variant]

  const eligibleEnvironments = target[config.eligibleEnvironmentsKey]
  const ineligibleEnvironments = target[config.ineligibleEnvironmentsKey]

  const [selectedEnvironments, setSelectedEnvironments] =
    useState<AuthAdminEnvironment[]>(eligibleEnvironments)
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
    onConfirm(target.subjectId, selectedEnvironments)
  }

  return (
    <Modal
      id={`${variant}-${target.subjectId}`}
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
                          <Tag
                            variant={config.disabledTagVariant}
                            outlined
                            disabled
                          >
                            {formatMessage(config.disabledTagMessage)}
                          </Tag>
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
