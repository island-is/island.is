import { useLocale } from '@island.is/localization'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { FormGroup } from '../components/form/FormGroup'
import { publishing } from '../lib/messages'
import { ChannelList } from '../components/communicationChannels/ChannelList'
import { AddChannel } from '../components/communicationChannels/AddChannel'
import { useState } from 'react'
import { useApplication } from '../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'

export const CommunicationChannels = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()

  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [index, setIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { updateApplication, application: fetchedApplication } = useApplication(
    {
      applicationId: application.id,
    },
  )

  const handleReset = () => {
    setName('')
    setEmail('')
    setPhone('')
    setIndex(null)
    setIsVisible(false)
  }

  const handleChange = (
    field: 'name' | 'email' | 'phone' | 'isVisible',
    value: string,
  ) => {
    switch (field) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'isVisible':
        setIsVisible(!!value)
        break
    }
  }

  const onRemoveChannel = (index: number) => {
    const currentAnswers = structuredClone(fetchedApplication.answers)
    const currentChannels = currentAnswers.advert?.channels ?? []
    const newChannels = currentChannels.filter((_, i) => i !== index)

    setValue(InputFields.advert.channels, newChannels)

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.channels,
      newChannels,
    )

    updateApplication(updatedAnswers)
    handleReset()
  }

  const onAddChannel = () => {
    const currentAnswers = structuredClone(fetchedApplication.answers)
    const currentChannels = currentAnswers.advert?.channels ?? []
    if (index !== null) {
      currentChannels[index] = { name, email, phone }
    } else {
      currentChannels.push({ name, email, phone })
    }

    setValue(InputFields.advert.channels, currentChannels)

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.channels,
      currentChannels,
    )

    updateApplication(updatedAnswers)
    handleReset()
  }
  return (
    <FormGroup
      title={f(publishing.headings.communications)}
      intro={f(publishing.general.communicationIntro)}
    >
      <ChannelList
        application={fetchedApplication}
        onOpenModal={(index, name, email, phone) => {
          setIndex(index)
          if (name) setName(name)
          if (email) setEmail(email)
          if (phone) setPhone(phone ?? '')
          setIsVisible(true)
        }}
        onRemoveChannel={onRemoveChannel}
      />
      <AddChannel
        name={name}
        email={email}
        phone={phone}
        isVisible={isVisible}
        onCancel={handleReset}
        onAddChannel={onAddChannel}
        onChange={handleChange}
      />
    </FormGroup>
  )
}
