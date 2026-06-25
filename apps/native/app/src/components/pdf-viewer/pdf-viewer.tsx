// Android's PdfRenderer (used by @kishannareshpal/expo-pdf) does not render
// AcroForm field appearances, so filled-in form fields show up blank on
// Android while rendering fine on iOS and the web. On Android we flatten the
// form with pdf-lib before display — this bakes the field appearances into
// the page content stream so PdfRenderer shows them.
import { DdLogs } from '@datadog/mobile-react-native'
import { PdfView } from '@kishannareshpal/expo-pdf'
import * as FileSystem from 'expo-file-system'
import { PDFDocument } from 'pdf-lib'
import { memo, useEffect, useState } from 'react'
import { Platform, ViewStyle } from 'react-native'

interface PdfViewerProps {
  uri: string
  style?: ViewStyle
}

export const PdfViewer = memo(({ uri, style }: PdfViewerProps) => {
  const [effectiveUri, setEffectiveUri] = useState<string | null>(
    Platform.OS === 'android' ? null : uri,
  )

  useEffect(() => {
    if (Platform.OS !== 'android') {
      setEffectiveUri(uri)
      return
    }
    let cancelled = false

    const flattenIfNeeded = async () => {
      try {
        const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache)
        const baseName =
          uri
            .split('/')
            .pop()
            ?.replace(/\.pdf$/i, '') ?? 'doc'
        const flatFile = new FileSystem.File(cacheDir, `${baseName}.flat.pdf`)
        if (flatFile.exists) {
          if (!cancelled) setEffectiveUri(flatFile.uri)
          return
        }

        const sourceFile = new FileSystem.File(uri)
        const bytes = await sourceFile.bytes()
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
        const form = doc.getForm()
        if (form.getFields().length === 0) {
          if (!cancelled) setEffectiveUri(uri)
          return
        }
        form.flatten()
        const flatBytes = await doc.save()
        flatFile.write(flatBytes)
        if (!cancelled) setEffectiveUri(flatFile.uri)
      } catch (e) {
        const err = e as Error
        console.warn(
          'Pdf flatten failed, falling back to original:',
          err?.message,
          err?.stack,
        )
        DdLogs.warn('Pdf flatten failed, falling back to original', {
          error: err?.message,
        })
        if (!cancelled) setEffectiveUri(uri)
      }
    }

    flattenIfNeeded()
    return () => {
      cancelled = true
    }
  }, [uri])

  if (!effectiveUri) return null
  return <PdfView uri={effectiveUri} style={style ?? { flex: 1 }} />
})

PdfViewer.displayName = 'PdfViewer'
