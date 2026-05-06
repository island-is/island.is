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
import type { TranslationRow } from '../Translations.types'
import { buildTranslationKey } from '../Translations.utils'

interface TranslationConfirmModalProps {
  target: TranslationRow
  configuredEnvironments: AuthAdminEnvironment[]
  onConfirm: (
    target: TranslationRow,
    environments: AuthAdminEnvironment[],
  ) => void
  onClose: () => void
}

export const TranslationConfirmModal = ({
  target,
  configuredEnvironments,
  onConfirm,
  onClose,
}: TranslationConfirmModalProps) => {
  const { formatMessage } = useLocale()

  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >(target.availableEnvironments ?? [])
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
      setError(formatMessage(m.translationsDeleteEnvironmentRequired))
      return
    }
    onConfirm(target, selectedEnvironments)
  }

  return (
    <Modal
      id={`delete-translation-${buildTranslationKey(target)}`}
      isVisible
      label={formatMessage(m.translationsDeleteConfirmTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.cancel)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Text variant="h2" as="h2" marginBottom={2}>
          {formatMessage(m.translationsDeleteConfirmTitle)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(m.translationsDeleteConfirmMessage)}
        </Text>

        <Box marginBottom={3}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.translationsDeleteSelectEnvironments)}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            columnGap={3}
            rowGap={2}
          >
            {authAdminEnvironments.map((env) => {
              const isTranslationEnv =
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
                      !isTranslationEnv || !configuredEnvironments.includes(env)
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
