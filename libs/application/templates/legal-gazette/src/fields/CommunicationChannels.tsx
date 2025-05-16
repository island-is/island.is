import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Input,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  EMAIL_REGEX,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { LGFieldBaseProps } from '../lib/types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'

type ChannelSchema = {
  email: string
  phone: string
}

const CHANNELS_PATH = 'communication.channels'

export const CommunicationChannels = ({
  application,
  errors,
}: LGFieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors } = useFormContext()

  const user = useUserInfo()

  const emptyChannelError = errors && getErrorViaPath(errors, CHANNELS_PATH)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)

  const channelAnswers = getValueViaPath(
    application.answers,
    CHANNELS_PATH,
    user.profile.email
      ? [{ email: user.profile.email, phone: user.profile.phone_number }]
      : [],
  ) as ChannelSchema[]

  const [channels, setChannels] = useState(channelAnswers)
  const [toggleAddChannel, setToggleAddChannel] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleEmailBlur = () => {
    const isValidEmail = newEmail.match(EMAIL_REGEX)

    if (!isValidEmail && newEmail.length > 0) {
      setEmailError(formatMessage(m.errors.invalidEmail))
    }
  }

  // set default value when the component mounts
  useEffect(() => {
    setValue(CHANNELS_PATH, channels)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddChannel = () => {
    if (editIndex !== null) {
      const currentChannels = [...channels]
      currentChannels[editIndex] = {
        email: newEmail,
        phone: newPhone,
      }
      setChannels(currentChannels)
      setValue(CHANNELS_PATH, currentChannels)
      setEditIndex(null)
      setNewEmail('')
      setNewPhone('')
      clearErrors([CHANNELS_PATH])
      setToggleAddChannel(false)
      return
    }

    const newChannels = [...channels, { email: newEmail, phone: newPhone }]
    setChannels(newChannels)
    setValue(CHANNELS_PATH, newChannels)
    setNewEmail('')
    setNewPhone('')
    setToggleAddChannel(false)
    setEditIndex(null)
    clearErrors([CHANNELS_PATH])
  }

  const removeChannel = (index: number) => {
    const newChannels = [...channels]
    newChannels.splice(index, 1)
    setChannels(newChannels)
    setValue(CHANNELS_PATH, newChannels)
  }

  return (
    <Stack space={3}>
      {emptyChannelError && (
        <Text color="red400" variant="small" fontWeight="medium">
          {emptyChannelError}
        </Text>
      )}
      {channels.length > 0 && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(m.draft.sections.communication.emailColumn)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.draft.sections.communication.phoneColumn)}
              </T.HeadData>
              <T.HeadData />
              <T.HeadData />
            </T.Row>
          </T.Head>
          <T.Body>
            {channels.map((channel, index) => (
              <T.Row key={index}>
                <T.Data>{channel.email}</T.Data>
                <T.Data>{channel.phone}</T.Data>
                <T.Data style={{ padding: 0, width: 24 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setEditIndex(index)
                        setNewEmail(channel.email)
                        setNewPhone(channel.phone)
                        setToggleAddChannel(true)
                      }}
                    >
                      <Icon color="blue400" size="small" icon="pencil" />
                    </button>
                  </Box>
                </T.Data>
                <T.Data style={{ padding: 0, width: 24 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeChannel(index)
                      }}
                    >
                      <Icon
                        color="blue400"
                        size="small"
                        icon="trash"
                        type="outline"
                      />
                    </button>
                  </Box>
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
      {toggleAddChannel && (
        <Box background="blue100" padding={3} borderRadius="large">
          <Stack space={2}>
            <GridRow>
              <GridColumn span={['12/12', '7/12']}>
                <Stack space={1}>
                  <Input
                    required
                    size="xs"
                    name="email"
                    type="email"
                    label={formatMessage(
                      m.draft.sections.communication.emailColumn,
                    )}
                    value={newEmail}
                    onChange={(e) => {
                      if (emailError) {
                        setEmailError(undefined)
                      }
                      setNewEmail(e.target.value)
                    }}
                    onBlur={handleEmailBlur}
                    errorMessage={emailError}
                  />
                </Stack>
              </GridColumn>
              <GridColumn span={['12/12', '5/12']}>
                <Input
                  size="xs"
                  name="phone"
                  label={formatMessage(
                    m.draft.sections.communication.phoneColumn,
                  )}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </GridColumn>
            </GridRow>
            <Inline space={2}>
              <Button
                variant="ghost"
                onClick={() => {
                  setNewEmail('')
                  setNewPhone('')
                  setEditIndex(null)
                  setToggleAddChannel(false)
                }}
                size="small"
              >
                {formatMessage(m.draft.sections.communication.cancel)}
              </Button>
              <Button
                disabled={!!emailError}
                size="small"
                onClick={handleAddChannel}
              >
                {formatMessage(m.draft.sections.communication.save)}
              </Button>
            </Inline>
          </Stack>
        </Box>
      )}
      <Button
        icon="add"
        onClick={() => {
          clearErrors([CHANNELS_PATH])
          setToggleAddChannel((prev) => !prev)
        }}
      >
        {formatMessage(m.draft.sections.communication.addChannelButton)}
      </Button>
    </Stack>
  )
}

export default CommunicationChannels
