import { useLocale } from '@island.is/localization'
import { OJOIFieldBaseProps } from '../lib/types'
import { FormGroup } from '../components/form/FormGroup'
import { publishing } from '../lib/messages'
import { ChannelList } from '../components/communicationChannels/ChannelList'
import { AddChannel } from '../components/communicationChannels/AddChannel'
import { useState } from 'react'

export const CommunicationChannels = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  return (
    <FormGroup
      title={f(publishing.headings.communications)}
      intro={f(publishing.general.communicationIntro)}
    >
      <ChannelList
        onEditChannel={(name, email, phone) => {
          if (name) setName(name)
          if (email) setEmail(email)
          if (phone) setPhone(phone ?? '')
          setIsVisible(true)
        }}
        applicationId={application.id}
      />
      <AddChannel
        defaultName={name}
        defaultEmail={email}
        defaultPhone={phone}
        defaultVisible={isVisible}
        applicationId={application.id}
      />
    </FormGroup>
  )
}
