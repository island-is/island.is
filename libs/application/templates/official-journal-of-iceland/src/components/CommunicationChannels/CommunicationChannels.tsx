import { Button } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { isValidEmail, isValidPhone } from '../../lib/utils'
import { error, general, publishingPreferences } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ChannelList } from './ChannelList'
import { AddChannel } from './AddChannel'

export type CommunicationChannel = {
  phone: string
  email: string
}

type Props = {
  channels: CommunicationChannel[]
  onChange: (channels: CommunicationChannel[]) => void
}

export const CommunicationChannels = ({ channels, onChange }: Props) => {
  const { formatMessage: f } = useLocale()
  const [addChannelToggle, setAddChannelToggle] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [alreadyExistsError, setAlreadyExistsError] = useState('')
  const [communicationChannels, setCommunicationChannels] =
    useState<CommunicationChannel[]>(channels)

  // call on change when channels change
  useEffect(() => {
    onChange(communicationChannels)
  }, [JSON.stringify(communicationChannels)])

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
      setEmailError(f(error.xIsNotValid, { x: f(general.email) }))
    }

    if (!validPhone) {
      setPhoneError(f(error.xIsNotValid, { x: f(general.phoneNumber) }))
    }

    if (found) {
      setAlreadyExistsError(
        f(error.xAlreadyExists, {
          x: f(
            publishingPreferences.general.communicationChannel,
          ).toLowerCase(),
        }),
      )
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
    <>
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
        {f(publishingPreferences.buttons.addCommunicationChannel.label)}
      </Button>
    </>
  )
}
