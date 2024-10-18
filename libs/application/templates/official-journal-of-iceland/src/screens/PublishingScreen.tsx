import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { publishing } from '../lib/messages'
import { Publishing } from '../fields/Publishing'
import { CommunicationChannels } from '../fields/CommunicationChannels'
import { Message } from '../fields/Message'

export const PublishingScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(publishing.general.title)}
      intro={f(publishing.general.intro)}
    >
      <Publishing {...props} />
      <CommunicationChannels {...props} />
      <Message {...props} />
    </FormScreen>
  )
}
