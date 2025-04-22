import { Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { general } from '../../lib/messages'
import { OJOIApplication } from '../../lib/types'
import { useOJOIUser } from '../../hooks/useOJOIUser'

type Props = {
  application: OJOIApplication
  onOpenModal?: (
    index: number,
    email?: string,
    phone?: string,
    name?: string,
  ) => void
  onRemoveChannel: (index: number) => void
}

export const ChannelList = ({
  application,
  onOpenModal,
  onRemoveChannel,
}: Props) => {
  const { formatMessage } = useLocale()

  const { user, loading } = useOJOIUser()

  const defaultName = `${user?.firstName} ${user?.lastName}`
  const defaultEmail = user?.email

  const initalChannel = {
    name: defaultName,
    email: defaultEmail,
    phone: undefined,
  }

  const channels = application.answers.advert?.channels || [initalChannel]

  if (channels.length === 0 || loading) {
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
                {onOpenModal && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenModal(
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
                {onOpenModal && (
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
