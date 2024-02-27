import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useId, useRef, useState } from 'react'
import { general, publishing } from '../../lib/messages'
import * as styles from './AddChannel.css'
import { Channel } from './Channel'
import { FormGroup } from '../form/FormGroup'
type Props = {
  onAdd: (channel: Channel) => void
  state: Channel
  setState: React.Dispatch<React.SetStateAction<Channel>>
}

export const AddChannel = ({ onAdd, state, setState }: Props) => {
  const { formatMessage: f } = useLocale()

  const phoneRef = useRef<HTMLInputElement>(null)

  const [isVisible, setIsVisible] = useState(false)

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
              name="email"
              type="email"
              value={state.email}
              label={f(general.email)}
              onChange={(e) => setState({ ...state, email: e.target.value })}
            />
          </Box>
          <Box className={styles.phoneWrap}>
            <Input
              ref={phoneRef}
              size="xs"
              name="tel"
              value={state.phone}
              label={f(general.phoneNumber)}
              onChange={(e) => setState({ ...state, phone: e.target.value })}
            />
          </Box>
        </Box>
        <Box className={styles.contentWrap}>
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              setIsVisible(!isVisible)
              setState({ email: '', phone: '' })
            }}
          >
            {f(general.cancel)}
          </Button>
          <Button
            disabled={!state.email}
            onClick={() => {
              onAdd(state)
              setState({ email: '', phone: '' })
            }}
            size="small"
          >
            {f(general.saveChanges)}
          </Button>
        </Box>
      </Box>
      <Box>
        <Button
          size="default"
          variant="primary"
          onClick={() => setIsVisible(!isVisible)}
          icon="add"
        >
          {f(publishing.buttons.addCommunicationChannel.label)}
        </Button>
      </Box>
    </FormGroup>
  )
}
