import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const PublishDateField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState(sdk.field.getValue() ?? '')

  useEffect(() => {
    const initialSys = sdk.entry.getSys()
    if (initialSys?.firstPublishedAt && !sdk.field.getValue()) {
      sdk.field.setValue(initialSys.firstPublishedAt)
      setValue(initialSys.firstPublishedAt)
    }
    sdk.entry.onSysChanged((sys) => {
      if (sys?.firstPublishedAt && !sdk.field.getValue()) {
        setValue(sys.firstPublishedAt)
        sdk.field.setValue(sys.firstPublishedAt).then(() => {
          // Since the entry was just published, we publish it again so the initial publish date gets saved as well
          sdk.entry.publish()
        })
      }
    })
  }, [sdk.entry, sdk.field])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  return <Box>{value ? new Date(value).toLocaleDateString('is-IS') : null}</Box>
}

export default PublishDateField
