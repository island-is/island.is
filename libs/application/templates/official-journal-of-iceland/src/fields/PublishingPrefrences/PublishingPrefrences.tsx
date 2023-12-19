import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Input, Link, Text } from '@island.is/island-ui/core'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import addYears from 'date-fns/addYears'
import format from 'date-fns/format'
import { useState } from 'react'
import { AddChannel } from '../../components/CommunicationChannels/AddChannel'
import { ChannelList } from '../../components/CommunicationChannels/ChannelList'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'
import { BooleanValue, VERDSKRA_LINK } from '../../shared'
import { getWeekdayDates } from '../../utils/isWeekday'
import { isValidEmail, isValidPhone } from '../../utils/validation'
import * as styles from './PublishingPrefrences.css'

export type CommunicationChannel = {
  phone: string
  email: string
}

export const PublishingPrefrences: React.FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { f } = useFormatMessage(application)
  const [addChannelToggle, setAddChannelToggle] = useState(false)
  const today = new Date()

  const [communicationChannels, setCommunicationChannels] = useState<
    CommunicationChannel[]
  >([])

  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [alreadyExistsError, setAlreadyExistsError] = useState('')

  const onSave = () => {
    setEmailError('')
    setPhoneError('')
    setAlreadyExistsError('')

    const validEmail = isValidEmail(newEmail)
    const validPhone = isValidPhone(newPhone)

    const found = communicationChannels.find(
      (c) => c.email === newEmail && c.phone === newPhone,
    )

    if (!validEmail) {
      setEmailError(f(m.emailError))
    }

    if (!validPhone) {
      setPhoneError(f(m.phoneError))
    }

    if (found) {
      setAlreadyExistsError(f(m.alreadyExistsError))
    }

    if (validEmail && validPhone && !found) {
      setCommunicationChannels((prev) => [
        ...prev,
        {
          email: newEmail,
          phone: newPhone,
        },
      ])
      setNewEmail('')
      setNewPhone('')
    }
  }

  const onCloseAddChannel = () => {
    setNewEmail('')
    setNewPhone('')
    setEmailError('')
    setPhoneError('')
    setAlreadyExistsError('')
    setAddChannelToggle(false)
  }

  const onRemoveChannel = (channel: CommunicationChannel) => {
    setCommunicationChannels((prev) =>
      prev.filter(
        (c) => c.email !== channel.email && c.phone !== channel.phone,
      ),
    )
  }

  const onEditChannel = (channel: CommunicationChannel) => {
    onRemoveChannel(channel)
    setNewEmail(channel.email)
    setNewPhone(channel.phone)
    setAddChannelToggle(true)
  }

  return (
    <Box>
      <FormIntro
        title={f(m.publishingPreferencesFormTitle)}
        description={f(m.publishingPreferencesFormIntro)}
      />
      <FormGroup title={f(m.publishingPreferencesDateLabel)}>
        <DatePickerController
          size="sm"
          backgroundColor="blue"
          id="publishingDate"
          defaultValue={format(today, 'yyyy-MM-dd')}
          minDate={today}
          locale="is"
          maxDate={addYears(today, 1)}
          excludeDates={getWeekdayDates()}
          label={f(m.date)}
        />
        <CheckboxController
          id="fastTrack"
          options={[
            {
              label: (
                <Text>
                  {f(m.requestFastTrack)}{' '}
                  <Link href={VERDSKRA_LINK}>
                    <span className={styles.fastTrackLink}>
                      {f(m.requestFastTrackLink)}
                    </span>
                  </Link>
                  .
                </Text>
              ),
              value: BooleanValue.YES,
            },
          ]}
        />
      </FormGroup>
      <FormGroup
        title={f(m.communicationChannelsTitle)}
        description={f(m.communicationChannelsIntro)}
      >
        <Box width="full">
          <ChannelList
            channels={communicationChannels}
            onRemoveChannel={onRemoveChannel}
            onEditChannel={onEditChannel}
          />
          <AddChannel
            visible={addChannelToggle}
            onPhoneChange={(e) => {
              setPhoneError('')
              setNewPhone(e.target.value)
            }}
            onEmailChange={(e) => {
              setEmailError('')
              setNewEmail(e.target.value)
            }}
            onClose={onCloseAddChannel}
            onSave={onSave}
            phoneValue={newPhone}
            emailValue={newEmail}
            emailError={emailError}
            phoneError={phoneError}
            alreadyExistsError={alreadyExistsError}
          />
          <Button
            size="small"
            onClick={() => setAddChannelToggle((prev) => !prev)}
            icon="add"
          >
            {f(m.addCommunicationChannel)}
          </Button>
        </Box>
      </FormGroup>
      <FormGroup title={f(m.messagesTitle)} description={f(m.messagesIntro)}>
        <Box width="full">
          <Input
            rows={4}
            id="messages"
            name="messages"
            textarea
            label={f(m.messagesTitle)}
            placeholder={f(m.messagesPlaceholder)}
          />
        </Box>
      </FormGroup>
    </Box>
  )
}
