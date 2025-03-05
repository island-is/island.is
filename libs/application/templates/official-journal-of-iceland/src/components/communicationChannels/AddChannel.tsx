import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { general, publishing } from '../../lib/messages'
import * as styles from './AddChannel.css'
import { FormGroup } from '../form/FormGroup'

type Props = {
  name: string
  email: string
  phone: string
  isVisible: boolean
  onChange(
    field: 'name' | 'email' | 'phone' | 'isVisible',
    value: string | boolean,
  ): void
  onCancel: () => void
  onAddChannel(): void
}

export const AddChannel = ({
  name,
  email,
  phone,
  isVisible,
  onChange,
  onAddChannel,
  onCancel,
}: Props) => {
  const { formatMessage: f } = useLocale()

  return (
    <FormGroup>
      <Box
        className={styles.addChannel({
          visible: isVisible,
        })}
        width="full"
      >
        <Box className={styles.contentWrap} marginBottom={5}>
          <Box className={styles.emailWrap}>
            <Input
              size="xs"
              name="name"
              type="text"
              value={name}
              label={f(general.name)}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </Box>
          <Box className={styles.emailWrap}>
            <Input
              size="xs"
              name="email"
              type="email"
              value={email}
              label={f(general.email)}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </Box>
          <Box className={styles.phoneWrap}>
            <Input
              size="xs"
              name="tel"
              value={phone}
              label={f(general.phoneNumber)}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </Box>
        </Box>
        <Box className={styles.contentWrap}>
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              onCancel()
            }}
          >
            {f(general.cancel)}
          </Button>
          <Button disabled={!email.length} size="small" onClick={onAddChannel}>
            {f(general.saveChanges)}
          </Button>
        </Box>
      </Box>
      <Box>
        <Button
          size="default"
          variant="primary"
          onClick={() => onChange('isVisible', !isVisible)}
          icon="add"
        >
          {f(publishing.buttons.addCommunicationChannel.label)}
        </Button>
      </Box>
    </FormGroup>
  )
}
