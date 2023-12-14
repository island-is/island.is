import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useId } from 'react'
import { m } from '../../lib/messages'
import * as styles from './AddChannel.css'
type Props = {
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (channel: React.ChangeEvent<HTMLInputElement>) => void
  onClose: (visible: boolean) => void
  onSave: () => void
  visible?: boolean
}

export const AddChannel = ({
  onPhoneChange,
  onEmailChange,
  onClose,
  onSave,
  visible = false,
}: Props) => {
  const localEmailId = useId()
  const localPhoneId = useId()

  const { formatMessage } = useLocale()

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
            label={formatMessage(m.email)}
            onChange={(e) =>
              onEmailChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </Box>
        <Box className={styles.phoneWrap}>
          <Input
            size="xs"
            id={localPhoneId}
            name="tel"
            label={formatMessage(m.phone)}
            onChange={(e) =>
              onPhoneChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </Box>
      </Box>
      <Box className={styles.contentWrap}>
        <Button size="small" variant="ghost" onClick={() => onClose(visible)}>
          {formatMessage(m.cancel)}
        </Button>
        <Button size="small" onClick={onSave}>
          {formatMessage(m.saveChanges)}
        </Button>
      </Box>
    </Box>
  )
}
