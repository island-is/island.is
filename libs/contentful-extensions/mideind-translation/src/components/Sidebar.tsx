import React, { useEffect } from 'react'
import { Button, Spinner } from '@contentful/forma-36-react-components'
import { SidebarExtensionSDK } from '@contentful/app-sdk'
import { useState } from 'react'
import { extractField, populateField } from '../fieldUtils/index'
import { translateTexts, sendTexts } from '../api'
import { signedCookies } from 'cookie-parser'

interface SidebarProps {
  sdk: SidebarExtensionSDK
}

interface SysVersion {
  id: string
  publishedCounter: number
  publishedVersion?: number
  version: number
  publishedAt: string
}

const hasPublishedDiff = (
  sys: SysVersion,
  publishedVersion: number,
): boolean => {
  return (
    (!!sys.publishedVersion && sys.publishedVersion != publishedVersion) ||
    sys.publishedCounter === 1
  )
}

// Checks whether version numbers are published according to Contentful's
// version numbering system
const isPublished = (sys: SysVersion): boolean => {
  return !!sys.publishedVersion && sys.version === sys.publishedVersion + 1
}

const handleClick = async (sdk: any) => {
  const fields = sdk.entry.fields
  const keys = Object.keys(fields)

  // 1 - Gather
  let texts: string[] = [] // Untranslated text collection
  let lines: any[] = [] // Keeps track of the lines of texts per field

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
  const [publishedVersion, setPublishedVersion] = useState(
    props.sdk.entry.getSys().publishedVersion,
  )

  const handlePublished = async (ref: any) => {
    if (isPublished(ref) && hasPublishedDiff(ref, publishedVersion)) {
      const fields = props.sdk.entry.fields
      const keys = Object.keys(fields)

      let iceTexts: string[] = []
      let enTexts: string[] = []

      for (const key of keys) {
        const field = fields[key]
        const eInterface = props.sdk.editor.editorInterface
        let iceExtractedTexts = extractField(field, eInterface) ?? []

        iceTexts = [...iceTexts, ...iceExtractedTexts]
      }

      for (const key of keys) {
        const field = fields[key]
        const eInterface = props.sdk.editor.editorInterface
        let enExtractedTexts = extractField(field, eInterface, 'en') ?? []

        enTexts = [...enTexts, ...enExtractedTexts]
      }

      // Filter away empty texts
      //iceTexts.filter(text => text.trim.length !== 0)
      //enTexts.filter(text => text.trim.length !== 0)

      sendTexts(iceTexts, enTexts)
    }
  }

  useEffect(() => {
    props.sdk.entry.onSysChanged(handlePublished)
  }, [])

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
