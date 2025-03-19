import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Note, Paragraph } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  DEFAULT_LOCALE,
} from '../../constants'

const ContentTypeNotificationsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await cma.entry.get({
        entryId: '1JUcJWxqrOPI5PoPrVwghQ',
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
      })
      const messageFromServer =
        data.fields?.fields?.[DEFAULT_LOCALE]?.[sdk.contentType.sys.id]
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

export default ContentTypeNotificationsField
