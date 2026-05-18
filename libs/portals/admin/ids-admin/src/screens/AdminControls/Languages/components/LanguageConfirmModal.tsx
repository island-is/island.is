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
import type { LanguageRow } from '../Languages.types'

interface LanguageConfirmModalProps {
  target: LanguageRow
  configuredEnvironments: AuthAdminEnvironment[]
  onConfirm: (isoKey: string, environments: AuthAdminEnvironment[]) => void
  onClose: () => void
}

export const LanguageConfirmModal = ({
  target,
  configuredEnvironments,
  onConfirm,
  onClose,
}: LanguageConfirmModalProps) => {
  const { formatMessage } = useLocale()

  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >(
    (target.availableEnvironments ?? []).filter((env) =>
      configuredEnvironments.includes(env),
    ),
  )
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
      setError(formatMessage(m.languagesDeleteEnvironmentRequired))
      return
    }
    onConfirm(target.isoKey, selectedEnvironments)
  }

  return (
    <Modal
      id={`delete-language-${target.isoKey}`}
      isVisible
      label={formatMessage(m.languagesDeleteConfirmTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.cancel)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Text variant="h2" as="h2" marginBottom={2}>
          {formatMessage(m.languagesDeleteConfirmTitle)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(m.languagesDeleteConfirmMessage)}
        </Text>

        <Box marginBottom={3}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.languagesDeleteSelectEnvironments)}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            columnGap={3}
            rowGap={2}
          >
            {authAdminEnvironments.map((env) => {
              const isLanguageEnv =
                target.availableEnvironments?.includes(env) ?? false
              return (
                <Box width="full" key={env}>
                  <Checkbox
                    label={env}
                    name="deleteEnvironments"
                    id={`deleteEnvironments.${env}`}
                    value={env}
                    checked={selectedEnvironments.includes(env)}
                    onChange={() => handleEnvironmentChange(env)}
                    disabled={
                      !isLanguageEnv || !configuredEnvironments.includes(env)
                    }
                    large
                  />
                </Box>
              )
            })}
          </Box>
          {error && (
            <InputError id="delete-environments-error" errorMessage={error} />
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
          <Button colorScheme="destructive" onClick={handleConfirm}>
            {formatMessage(m.delete)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
