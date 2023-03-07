import { useEffect, useState } from 'react'
import { Note, Paragraph } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const ConentTypeNotificationsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await cma.entry.get({
        entryId: '1JUcJWxqrOPI5PoPrVwghQ',
        environmentId: 'master',
        spaceId: '8k0h54kbe6bj',
      })
      const messageFromServer =
        data.fields?.fields?.['is-IS']?.[sdk.contentType.sys.id]
      if (messageFromServer) setMessage(messageFromServer)
    }
    fetchMessage()
  }, [cma.entry, sdk.contentType.sys.id])

  if (!message) return null

  return (
    <Note variant="primary">
      <Paragraph>{message}</Paragraph>
    </Note>
  )
}

export default ConentTypeNotificationsField
