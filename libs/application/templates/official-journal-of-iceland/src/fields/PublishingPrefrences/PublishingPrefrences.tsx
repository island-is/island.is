import { Box, Button, Input } from '@island.is/island-ui/core'
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
import { error, general, publishingPrefrences } from '../../lib/messages'
import { BooleanValue, OJOIFieldBaseProps } from '../../lib/types'
import { getWeekdayDates, isValidEmail, isValidPhone } from '../../lib/utils'
export type CommunicationChannel = {
  phone: string
  email: string
}

export const PublishingPrefrences = ({ application }: OJOIFieldBaseProps) => {
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
      setEmailError(f(error.xIsNotValid, { x: f(general.email) }))
    }

    if (!validPhone) {
      setPhoneError(f(error.xIsNotValid, { x: f(general.phoneNumber) }))
    }

    if (found) {
      setAlreadyExistsError(
        f(error.xAlreadyExists, {
          x: f(publishingPrefrences.general.communicationChannel).toLowerCase(),
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
    <Box>
      <FormIntro
        title={f(publishingPrefrences.general.formTitle)}
        description={f(publishingPrefrences.general.formIntro)}
      />
      <FormGroup title={f(publishingPrefrences.dateChapter.title)}>
        <DatePickerController
          size="sm"
          backgroundColor="blue"
          id="publishingDate"
          defaultValue={format(today, 'yyyy-MM-dd')}
          minDate={today}
          locale="is"
          maxDate={addYears(today, 1)}
          excludeDates={getWeekdayDates()}
          label={f(publishingPrefrences.inputs.datepicker.label)}
        />
        <CheckboxController
          id="fastTrack"
          options={[
            {
              label: f(publishingPrefrences.inputs.fastTrack.label),
              value: BooleanValue.YES,
            },
          ]}
        />
      </FormGroup>
      <FormGroup
        title={f(publishingPrefrences.communicationChapter.title)}
        description={f(publishingPrefrences.communicationChapter.intro)}
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
            {f(publishingPrefrences.buttons.addCommunicationChannel.label)}
          </Button>
        </Box>
      </FormGroup>
      <FormGroup
        title={f(publishingPrefrences.messagesChapter.title)}
        description={f(publishingPrefrences.messagesChapter.intro)}
      >
        <Box width="full">
          <Input
            rows={4}
            id="messages"
            name="messages"
            textarea
            label={f(publishingPrefrences.inputs.messages.label)}
            placeholder={f(publishingPrefrences.inputs.messages.placeholder)}
          />
        </Box>
      </FormGroup>
    </Box>
  )
}
