import { Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { general } from '../../lib/messages'
import { useApplication } from '../../hooks/useUpdateApplication'
import { InputFields } from '../../lib/types'
import set from 'lodash/set'

type Props = {
  applicationId: string
  onEditChannel: (email?: string, phone?: string) => void
}

export const ChannelList = ({ applicationId, onEditChannel }: Props) => {
  const { formatMessage } = useLocale()

  const { application, updateApplication } = useApplication({
    applicationId,
  })

  const channels = application.answers.advert?.channels || []

  const onRemoveChannel = (email?: string) => {
    const currentAnswers = structuredClone(application.answers)
    const currentChannels = currentAnswers.advert?.channels ?? []

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.channels,
      currentChannels.filter((channel) => channel.email !== email),
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
          <T.HeadData>{formatMessage(general.email)}</T.HeadData>
          <T.HeadData>{formatMessage(general.phoneNumber)}</T.HeadData>
          <T.HeadData></T.HeadData>
          <T.HeadData></T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {channels.map((channel, i) => (
          <T.Row key={i}>
            <T.Data>{channel.email}</T.Data>
            <T.Data>{channel.phone}</T.Data>
            <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
              <button
                type="button"
                onClick={() => onEditChannel(channel.email, channel.phone)}
              >
                <Icon color="blue400" icon="pencil" />
              </button>
            </T.Data>
            <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
              <button
                type="button"
                onClick={() => onRemoveChannel(channel.email)}
              >
                <Icon color="blue400" icon="trash" />
              </button>
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
