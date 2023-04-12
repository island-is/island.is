import { useEffect, useState } from 'react'
import { Button, Spinner } from '@contentful/f36-components'
import { TextIcon } from '@contentful/f36-icons'
import { SidebarExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { extractField, populateField } from './fieldUtils/index'
import { translateTexts, sendTexts } from './api'

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
    (!!sys.publishedVersion && sys.publishedVersion !== publishedVersion) ||
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
  const lines: any[] = [] // Keeps track of the lines of texts per field

  for (const key of keys) {
    const field = fields[key]
    const eInterface = sdk.editor.editorInterface
    const extractedTexts = extractField(field, eInterface) ?? []

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
    const stride = lines.pop() | 0

    if (stride === 0) {
      continue
    }

    const translatedFieldTexts = translatedTexts.splice(-stride)

    populateField(field, eInterface, translatedFieldTexts)
  }
}

export const MideindTranslationSidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>()

  const [loading, setLoading] = useState(false)
  const [publishedVersion, setPublishedVersion] = useState(
    sdk?.entry?.getSys()?.publishedVersion as number,
  )

  useEffect(() => {
    setPublishedVersion(sdk.entry.getSys().publishedVersion as number)
  }, [sdk.entry])

  const handlePublished = async (ref: any) => {
    if (isPublished(ref) && hasPublishedDiff(ref, publishedVersion)) {
      const fields = sdk.entry.fields
      const keys = Object.keys(fields)

      // A reference for Miðeind
      // {content-id}:{versionNumberAtTranslateTime}
      const translationReference = `${sdk.entry.getSys().id}:${
        parseInt(String(publishedVersion), 10) - 1
      }`

      let iceTexts: string[] = []
      let enTexts: string[] = []

      for (const key of keys) {
        const field = fields[key]
        const eInterface = sdk.editor.editorInterface
        const iceExtractedTexts = extractField(field, eInterface) ?? []

        iceTexts = [...iceTexts, ...iceExtractedTexts]
      }

      for (const key of keys) {
        const field = fields[key]
        const eInterface = sdk.editor.editorInterface
        const enExtractedTexts = extractField(field, eInterface, 'en') ?? []

        enTexts = [...enTexts, ...enExtractedTexts]
      }

      sendTexts(iceTexts, enTexts, translationReference)
    }
  }

  useEffect(() => {
    sdk.entry.onSysChanged(handlePublished)
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        startIcon={<TextIcon />}
        color="white"
        variant="positive"
        isDisabled={loading}
        style={{ width: '100%' }}
        onClick={async () => {
          setLoading(true)
          await handleClick(sdk)
          setLoading(false)
        }}
      >
        {loading ? <Spinner /> : 'Translate to English'}
      </Button>
    </div>
  )
}
