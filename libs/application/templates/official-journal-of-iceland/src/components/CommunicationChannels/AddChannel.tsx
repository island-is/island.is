import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useId, useRef } from 'react'
import { general } from '../../lib/messages'
import * as styles from './AddChannel.css'
type Props = {
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (channel: React.ChangeEvent<HTMLInputElement>) => void
  onClose: (visible: boolean) => void
  onSave: () => void
  phoneValue?: string
  emailValue?: string
  emailError?: string
  phoneError?: string
  alreadyExistsError?: string
  visible?: boolean
}

export const AddChannel = ({
  onPhoneChange,
  onEmailChange,
  onClose,
  onSave,
  phoneValue,
  emailValue,
  emailError,
  phoneError,
  alreadyExistsError,
  visible = false,
}: Props) => {
  const localEmailId = useId()
  const localPhoneId = useId()

  const { formatMessage } = useLocale()

  const phoneRef = useRef<HTMLInputElement>(null)

  return (
    <Box
      className={styles.addChannel({
        visible,
      })}
      width="full"
    >
      <Box className={styles.contentWrap} marginBottom={5}>
        <Box className={styles.emailWrap}>
          <Input
            size="xs"
            id={localEmailId}
            name="email"
            type="email"
            errorMessage={emailError}
            label={formatMessage(general.email)}
            value={emailValue}
            onChange={(e) =>
              onEmailChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                phoneRef.current &&
                e.currentTarget.value
              ) {
                phoneRef.current.focus()
              }
            }}
          />
        </Box>
        <Box className={styles.phoneWrap}>
          <Input
            ref={phoneRef}
            size="xs"
            id={localPhoneId}
            name="tel"
            errorMessage={phoneError}
            value={phoneValue}
            label={formatMessage(general.phoneNumber)}
            onChange={(e) =>
              onPhoneChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSave()
              }
            }}
          />
        </Box>
      </Box>
      <Box className={styles.contentWrap}>
        {alreadyExistsError && (
          <Box width="full">
            <Text>
              <span className={styles.errorText}>{alreadyExistsError}</span>
            </Text>
          </Box>
        )}
        <Button size="small" variant="ghost" onClick={() => onClose(visible)}>
          {formatMessage(general.cancel)}
        </Button>
        <Button
          disabled={!phoneValue || !emailValue}
          size="small"
          onClick={onSave}
        >
          {formatMessage(general.saveChanges)}
        </Button>
      </Box>
    </Box>
  )
}
