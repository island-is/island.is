import { useEffect, useRef, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import copyToClipboard from 'copy-to-clipboard'
import addMonths from 'date-fns/addMonths'

import {
  AlertMessage,
  Box,
  Button,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { DirectorateOfEqualityApiKeyType } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m as coreMessages, Modal } from '@island.is/portals/my-pages/core'

import {
  DEFAULT_VALIDITY,
  NO_EXPIRY,
  VALIDITY_OPTIONS,
  Validity,
} from '../../../lib/apiKeys'
import { messages } from '../../../lib/messages'

export const CreateApiKeyModal = ({
  isServiceProvider,
  issuing,
  issuedKey,
  onSubmit,
  onClose,
}: {
  isServiceProvider: boolean
  issuing: boolean
  issuedKey: string | null
  onSubmit: (input: {
    label: string | null
    expiresAt: string | null
    type: DirectorateOfEqualityApiKeyType
  }) => void
  onClose: () => void
}) => {
  const { formatMessage } = useLocale()
  const [label, setLabel] = useState('')
  const [validity, setValidity] = useState<Validity>(DEFAULT_VALIDITY)
  const [type, setType] = useState<DirectorateOfEqualityApiKeyType | null>(null)
  const [showTypeError, setShowTypeError] = useState(false)
  const keyInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (issuedKey) {
      keyInputRef.current?.focus()
    }
  }, [issuedKey])

  const validityLabels: Record<Validity, MessageDescriptor> = {
    [NO_EXPIRY]: messages.validityNone,
    3: messages.validity3,
    6: messages.validity6,
    12: messages.validity12,
    24: messages.validity24,
  }
  const options = VALIDITY_OPTIONS.map((value) => ({
    value,
    label: formatMessage(validityLabels[value]),
  }))
  const typeOptions = [
    {
      value: DirectorateOfEqualityApiKeyType.COMPANY,
      label: formatMessage(messages.keyTypeCompany),
    },
    {
      value: DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER,
      label: formatMessage(messages.keyTypeServiceProvider),
    },
  ]
  const title = formatMessage(messages.createCompanyKey)

  return (
    <Modal
      id="directorate-of-equality-create-key"
      label={issuedKey ? formatMessage(messages.keyCreatedTitle) : title}
      title={issuedKey ? formatMessage(messages.keyCreatedTitle) : title}
      text={issuedKey ? undefined : formatMessage(messages.createKeyText)}
      onCloseModal={onClose}
      buttonsSpacing={issuedKey ? 'flexEnd' : 'spaceBetween'}
      buttons={
        issuedKey
          ? [
              {
                id: 'directorate-of-equality-key-created-close',
                type: 'primary',
                text: formatMessage(coreMessages.close),
                onClick: onClose,
              },
            ]
          : [
              {
                id: 'directorate-of-equality-create-key-cancel',
                type: 'ghost',
                text: formatMessage(coreMessages.buttonCancel),
                onClick: onClose,
              },
              {
                id: 'directorate-of-equality-create-key-submit',
                type: 'primary',
                text: formatMessage(messages.createKeySubmit),
                loading: issuing,
                onClick: () => {
                  if (isServiceProvider && !type) {
                    setShowTypeError(true)
                    return
                  }
                  onSubmit({
                    label: label.trim() || null,
                    expiresAt:
                      validity === NO_EXPIRY
                        ? null
                        : addMonths(new Date(), validity).toISOString(),
                    type: type ?? DirectorateOfEqualityApiKeyType.COMPANY,
                  })
                },
              },
            ]
      }
    >
      {issuedKey ? (
        <>
          <AlertMessage
            type="warning"
            message={formatMessage(messages.keyCreatedWarning)}
          />
          <Box marginTop={3}>
            <Input
              ref={keyInputRef}
              name="issued-api-key"
              label={formatMessage(messages.keyValue)}
              value={issuedKey}
              readOnly
              backgroundColor="blue"
              size="sm"
            />
          </Box>
          <Box marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="copy"
              iconType="outline"
              onClick={() =>
                copyToClipboard(issuedKey)
                  ? toast.success(formatMessage(messages.copyKeySuccess))
                  : toast.error(formatMessage(messages.copyKeyError))
              }
            >
              {formatMessage(coreMessages.copy)}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Input
            name="api-key-label"
            label={formatMessage(messages.keyLabel)}
            placeholder={formatMessage(messages.keyLabelPlaceholderCompany)}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            backgroundColor="blue"
            size="sm"
            maxLength={100}
          />
          <Text variant="small" marginTop={1}>
            {formatMessage(messages.keyLabelHint)}
          </Text>
          {isServiceProvider && (
            <Box marginTop={3}>
              <Select
                name="api-key-type"
                label={formatMessage(messages.keyType)}
                placeholder={formatMessage(messages.keyTypePlaceholder)}
                options={typeOptions}
                value={
                  typeOptions.find((option) => option.value === type) ?? null
                }
                onChange={(option) => {
                  if (option) {
                    setType(option.value)
                    setShowTypeError(false)
                  }
                }}
                hasError={showTypeError}
                errorMessage={formatMessage(messages.keyTypeError)}
                menuPosition="fixed"
                closeMenuOnScroll
                backgroundColor="blue"
                size="sm"
              />
              <Text variant="small" marginTop={1}>
                {formatMessage(messages.keyTypeHint)}
              </Text>
            </Box>
          )}
          <Box marginTop={3}>
            <Select
              name="api-key-validity"
              label={formatMessage(messages.validity)}
              options={options}
              value={options.find((option) => option.value === validity)}
              onChange={(option) => option && setValidity(option.value)}
              menuPosition="fixed"
              closeMenuOnScroll
              backgroundColor="blue"
              size="sm"
            />
          </Box>
          <Text variant="small" marginTop={1}>
            {formatMessage(messages.validityHint)}
          </Text>
        </>
      )}
    </Modal>
  )
}
