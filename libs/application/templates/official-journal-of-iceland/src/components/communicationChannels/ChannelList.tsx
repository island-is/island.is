import { Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import set from 'lodash/set'
import { useApplication } from '../../hooks/useUpdateApplication'
import { general } from '../../lib/messages'
import { InputFields } from '../../lib/types'

type Props = {
  applicationId: string
  onEditChannel?: (
    index: number,
    email?: string,
    phone?: string,
    name?: string,
  ) => void
}

export const ChannelList = ({ applicationId, onEditChannel }: Props) => {
  const { formatMessage } = useLocale()

  const { application, updateApplication } = useApplication({
    applicationId,
  })

  const userInfo = useUserInfo()

  const defaultName = userInfo?.profile?.name
  const defaultEmail = userInfo?.profile?.email
  const defaultPhone = userInfo?.profile?.phone_number

  const initalChannel = {
    name: defaultName,
    email: defaultEmail,
    phone: defaultPhone,
  }

  const channels = application.answers.advert?.channels || [initalChannel]

  const onRemoveChannel = (index?: number) => {
    const currentAnswers = structuredClone(application.answers)
    const currentChannels = currentAnswers.advert?.channels ?? []

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.channels,
      currentChannels.filter((_, i) => i !== index),
    )

    updateApplication(updatedAnswers)
  }

  if (channels.length === 0) {
    return null
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(general.name)}</T.HeadData>
          <T.HeadData>{formatMessage(general.email)}</T.HeadData>
          <T.HeadData>{formatMessage(general.phoneNumber)}</T.HeadData>
          <T.HeadData></T.HeadData>
          <T.HeadData></T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {channels.map((channel, i) => {
          return (
            <T.Row key={i}>
              <T.Data>{channel.name}</T.Data>
              <T.Data>{channel.email}</T.Data>
              <T.Data>{channel.phone}</T.Data>
              <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
                {onEditChannel && (
                  <button
                    type="button"
                    onClick={() =>
                      onEditChannel(
                        i,
                        channel.name,
                        channel.email,
                        channel.phone,
                      )
                    }
                  >
                    <Icon color="blue400" icon="pencil" />
                  </button>
                )}
              </T.Data>

              <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
                {onEditChannel && (
                  <button type="button" onClick={() => onRemoveChannel(i)}>
                    <Icon color="blue400" icon="trash" />
                  </button>
                )}
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
