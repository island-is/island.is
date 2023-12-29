import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { Box, Button } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { AddChannel } from '../../components/CommunicationChannels/AddChannel'
import { ChannelList } from '../../components/CommunicationChannels/ChannelList'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { error, general, publishingPreferences } from '../../lib/messages'
import { BooleanValue, OJOIFieldBaseProps } from '../../lib/types'
import { isValidEmail, isValidPhone } from '../../lib/utils'
export type CommunicationChannel = {
  phone: string
  email: string
}

export const PublishingPreferences = ({ application }: OJOIFieldBaseProps) => {
  const { f, locale } = useFormatMessage(application)
  const [addChannelToggle, setAddChannelToggle] = useState(false)

  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)

  const [communicationChannels, setCommunicationChannels] = useState<
    CommunicationChannel[]
  >([])

  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [alreadyExistsError, setAlreadyExistsError] = useState('')

  useEffect(() => {
    const update = async () => {
      await updateApplication({
        variables: {
          locale,
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              publishingPreferences: {
                date: application.answers.publishingPreferences?.date ?? '',
                fastTrack:
                  application.answers.publishingPreferences?.fastTrack ??
                  BooleanValue.NO,
                message:
                  application.answers.publishingPreferences?.message ?? '',
                communicationChannels: [...communicationChannels],
              },
            },
          },
        },
      })
    }

    update()
  }, [communicationChannels])

  const onSave = async () => {
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
    <FormGroup
      title={f(publishingPreferences.communicationChapter.title)}
      description={f(publishingPreferences.communicationChapter.intro)}
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
          {f(publishingPreferences.buttons.addCommunicationChannel.label)}
        </Button>
      </Box>
    </FormGroup>
  )
}
