import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { Box } from '@contentful/f36-components'

const PublishDateField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState(sdk.field.getValue() ?? '')

  useEffect(() => {
    const initialSys = sdk.entry.getSys()
    if (initialSys?.firstPublishedAt) {
      sdk.field.setValue(initialSys.firstPublishedAt)
      setValue(initialSys.firstPublishedAt)
    }
    sdk.entry.onSysChanged((sys) => {
      if (sys.firstPublishedAt) {
        sdk.field.setValue(sys.firstPublishedAt)
        setValue(sys.firstPublishedAt)
      }
    })
  }, [sdk.entry, sdk.field])

  return <Box>{value ? new Date(value).toLocaleDateString('is-IS') : null}</Box>
}

export default PublishDateField
