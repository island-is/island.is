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
import type { TranslationModalState } from '../hooks/useTranslationModal'

interface TranslationModalProps {
  modal: TranslationModalState
}

export const TranslationModal = ({ modal }: TranslationModalProps) => {
  const { formatMessage } = useLocale()

  if (!modal.modalVisible) {
    return null
  }

  return (
    <Modal
      id="translation-modal"
      isVisible={modal.modalVisible}
      label={
        modal.isEditing
          ? formatMessage(m.translationsEditTitle)
          : formatMessage(m.translationsCreateNew)
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
              ? formatMessage(m.translationsEditTitle)
              : formatMessage(m.translationsCreateNew)}
          </Text>
          {modal.isEditing &&
            (modal.loadingTranslation ? (
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
            {modal.isEditing && modal.loadingTranslation ? (
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
                {modal.isEditing ? (
                  <Input
                    name="language"
                    label={formatMessage(m.translationsLanguage)}
                    value={modal.formData.language}
                    disabled
                    size="sm"
                    backgroundColor="blue"
                  />
                ) : (
                  <Select
                    name="language"
                    label={formatMessage(m.translationsLanguage)}
                    options={modal.languageOptions}
                    value={modal.languageOptions.find(
                      (opt) => opt.value === modal.formData.language,
                    )}
                    size="sm"
                    backgroundColor="blue"
                    hasError={!!modal.formErrors.language}
                    errorMessage={modal.formErrors.language}
                    onChange={(opt) => {
                      if (!opt) return
                      modal.setFormField('language', opt.value as string)
                    }}
                  />
                )}
                <Input
                  name="className"
                  label={formatMessage(m.translationsClassName)}
                  value={modal.formData.className}
                  onChange={(e) =>
                    modal.setFormField('className', e.target.value)
                  }
                  disabled={modal.isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.className}
                  errorMessage={modal.formErrors.className}
                />
                <Input
                  name="property"
                  label={formatMessage(m.translationsProperty)}
                  value={modal.formData.property}
                  onChange={(e) =>
                    modal.setFormField('property', e.target.value)
                  }
                  disabled={modal.isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.property}
                  errorMessage={modal.formErrors.property}
                />
                <Input
                  name="key"
                  label={formatMessage(m.translationsKey)}
                  value={modal.formData.key}
                  onChange={(e) => modal.setFormField('key', e.target.value)}
                  disabled={modal.isEditing}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.key}
                  errorMessage={modal.formErrors.key}
                />
                <Input
                  name="value"
                  label={formatMessage(m.translationsValue)}
                  value={modal.formData.value}
                  onChange={(e) => modal.setFormField('value', e.target.value)}
                  textarea
                  rows={3}
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.value}
                  errorMessage={modal.formErrors.value}
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
              <Button
                onClick={modal.handleSubmit}
                loading={modal.isSubmitting}
                disabled={modal.loadingTranslation}
              >
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
