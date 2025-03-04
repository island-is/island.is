import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { general, publishing } from '../../lib/messages'
import * as styles from './AddChannel.css'
import { FormGroup } from '../form/FormGroup'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import { InputFields } from '../../lib/types'

type Props = {
  applicationId: string
  defaultName?: string
  defaultEmail?: string
  defaultPhone?: string
  defaultVisible?: boolean
  indexOfEditingChannel: number | null
  setIndexOfEditingChannel: (index: number | null) => void
}

export const AddChannel = ({
  applicationId,
  defaultName,
  defaultEmail,
  defaultPhone,
  defaultVisible,
  indexOfEditingChannel,
  setIndexOfEditingChannel
}: Props) => {
  const { application, updateApplication } = useApplication({
    applicationId,
  })
  const { formatMessage: f } = useLocale()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isVisible, setIsVisible] = useState(defaultVisible ?? false)

  useEffect(() => {
    setName(defaultName ?? name)
    setEmail(defaultEmail ?? email)
    setPhone(defaultPhone ?? phone)
    setIsVisible(defaultVisible ?? false)
  }, [defaultName, defaultEmail, defaultPhone, defaultVisible])

  const onAddChannel = () => {
    const currentAnswers = structuredClone(application.answers)
    const currentChannels = currentAnswers.advert?.channels ?? []
    if (indexOfEditingChannel !== null) {
      currentChannels[indexOfEditingChannel] = { name, email, phone }
    } else {
      currentChannels.push({ name, email, phone })
    }
    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.channels,
      currentChannels,
    )

    updateApplication(updatedAnswers)
    setIsVisible(!isVisible)
    setName('')
    setEmail('')
    setPhone('')
    setIndexOfEditingChannel(null)
  }

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
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box className={styles.emailWrap}>
            <Input
              size="xs"
              name="email"
              type="email"
              value={email}
              label={f(general.email)}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box className={styles.phoneWrap}>
            <Input
              size="xs"
              name="tel"
              value={phone}
              label={f(general.phoneNumber)}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Box>
        </Box>
        <Box className={styles.contentWrap}>
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              setIsVisible(!isVisible)
              setName('')
              setEmail('')
              setPhone('')
              setIndexOfEditingChannel(null)
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
          onClick={() => setIsVisible(!isVisible)}
          icon="add"
        >
          {f(publishing.buttons.addCommunicationChannel.label)}
        </Button>
      </Box>
    </FormGroup>
  )
}
