import React from 'react'
import { Button, Spinner } from '@contentful/forma-36-react-components'
import { SidebarExtensionSDK } from '@contentful/app-sdk'
import { useState } from 'react'
import { extractField, populateField } from '../fieldUtils/index'
import { translateTexts } from '../api'

interface SidebarProps {
  sdk: SidebarExtensionSDK
}

const handleClick = async (sdk: any) => {
  const fields = sdk.entry.fields
  const keys = Object.keys(fields)

  // 1 - Gather
  var texts: string[] = [] // Untranslated text collection
  var lines: any[] = [] // Keeps track of the lines of texts per field

  for (const key of keys) {
    const field = fields[key]
    const eInterface = sdk.editor.editorInterface
    let extractedTexts = extractField(field, eInterface) ?? []

    texts = [...texts, ...extractedTexts]
    lines.push(extractedTexts.length)
  }

  // 2 - Translate
  const translatedTexts = await translateTexts(texts)

  // 3 - Reverse populate the fields
  translatedTexts.reverse()
  lines.reverse()

  for (const key of keys) {
    const field = fields[key]
    const eInterface = sdk.editor.editorInterface

    // Take the correct amount of translated texts from the translation pool
    let stride = lines.pop() | 0

    if (stride === 0) {
      continue
    }

    let translatedFieldTexts = translatedTexts.splice(-stride)

    populateField(field, eInterface, translatedFieldTexts)
  }
}

const Sidebar = (props: SidebarProps) => {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Button
        icon="Text"
        buttonType="positive"
        disabled={loading}
        style={{ width: '100%' }}
        onClick={async () => {
          setLoading(true)
          await handleClick(props.sdk)
          setLoading(false)
        }}
      >
        {loading ? 'Translating...' : 'Translate to English'}
      </Button>
      {loading && <Spinner />}
    </>
  )
}

export default Sidebar
