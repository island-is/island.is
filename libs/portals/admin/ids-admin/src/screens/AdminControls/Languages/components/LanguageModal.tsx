import React from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputError,
  LoadingDots,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { LanguageModalState } from '../hooks/useLanguageModal'

interface LanguageModalProps {
  modal: LanguageModalState
}

export const LanguageModal = ({ modal }: LanguageModalProps) => {
  const { formatMessage } = useLocale()

  if (!modal.modalVisible) {
    return null
  }

  return (
    <Modal
      id="language-modal"
      isVisible={modal.modalVisible}
      label={
        modal.isEditing
          ? formatMessage(m.languagesEditTitle)
          : formatMessage(m.languagesCreateNew)
      }
      onClose={modal.resetModalState}
      closeButtonLabel={formatMessage(m.cancel)}
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
            {modal.isEditing
              ? formatMessage(m.languagesEditTitle)
              : formatMessage(m.languagesCreateNew)}
          </Text>
          {modal.isEditing &&
            (modal.loadingLanguage ? (
              <Box style={{ minWidth: 200 }}>
                <SkeletonLoader height={40} borderRadius="large" />
              </Box>
            ) : (
              <Select
                name="publishEnvironment"
                label={formatMessage(m.environment)}
                options={modal.environmentOptions}
                value={modal.environmentOptions.find(
                  (opt) => opt.value === modal.selectedEnvResult.environment,
                )}
                size="sm"
                backgroundColor="blue"
                isDisabled={modal.isPublishing}
                onChange={(opt) => {
                  if (!opt) return
                  const env = opt.value as AuthAdminEnvironment
                  modal.handleEnvironmentSwitch(env)
                }}
              />
            ))}
        </Box>

        <Box marginBottom={3}>
          <Stack space={3}>
            {modal.isEditing && modal.loadingLanguage ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingTop={4}
              >
                <LoadingDots size="medium" />
              </Box>
            ) : (
              <>
                <Input
                  name="isoKey"
                  label={formatMessage(m.languagesIsoKey)}
                  value={modal.formData.isoKey}
                  onChange={(e) => modal.setFormField('isoKey', e.target.value)}
                  disabled={modal.isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.isoKey}
                  errorMessage={modal.formErrors.isoKey}
                />
                <Input
                  name="description"
                  label={formatMessage(m.languagesDescription)}
                  value={modal.formData.description}
                  onChange={(e) =>
                    modal.setFormField('description', e.target.value)
                  }
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.description}
                  errorMessage={modal.formErrors.description}
                />
                <Input
                  name="englishDescription"
                  label={formatMessage(m.languagesEnglishDescription)}
                  value={modal.formData.englishDescription}
                  onChange={(e) =>
                    modal.setFormField('englishDescription', e.target.value)
                  }
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.englishDescription}
                  errorMessage={modal.formErrors.englishDescription}
                />
              </>
            )}

            {!modal.isEditing && (
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
                        checked={modal.selectedEnvironments.includes(env)}
                        onChange={() =>
                          modal.handleEnvironmentCheckboxChange(env)
                        }
                        disabled={!modal.configuredEnvironments.includes(env)}
                        large
                      />
                    </Box>
                  ))}
                </Box>
                {modal.formErrors.environments && (
                  <InputError
                    id="environments-error"
                    errorMessage={modal.formErrors.environments}
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
              <Button variant="ghost" onClick={modal.resetModalState}>
                {formatMessage(m.cancel)}
              </Button>
              <Button onClick={modal.handleSubmit} loading={modal.isSubmitting}>
                {modal.isEditing
                  ? formatMessage(m.save)
                  : formatMessage(m.create)}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
