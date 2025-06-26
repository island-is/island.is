import { DdLogs } from '@datadog/mobile-react-native'
import { memo, useState } from 'react'
import { Platform } from 'react-native'
import Pdf from 'react-native-pdf'

interface PdfViewerProps {
  url: string
  subject: string
  senderName: string
  onLoaded: (path: string) => void
  onError: (err: Error) => void
}

export const PdfViewer = memo(
  ({ url, subject, senderName, onLoaded, onError }: PdfViewerProps) => {
    const [actualUrl, setActualUrl] = useState(url)
    const extraProps = {
      activityIndicatorProps: {
        color: '#0061ff',
        progressTintColor: '#ccdfff',
      },
    }

    return (
      <Pdf
        spacing={0}
        source={{ uri: actualUrl }}
        onLoadComplete={(_, filePath) => {
          onLoaded?.(filePath)
        }}
        onError={(err) => {
          // Send error to Datadog with document subject and sender name
          DdLogs.warn(`PDF error for document "${subject}"`, {
            error: (err as Error)?.message,
            documentTitle: subject,
            documentSenderName: senderName,
          })

          // Check if actualUrl contains any whitespace character and update if needed
          // The Base64 logic on iOS does not support whitespace.
          if (/\s/.test(actualUrl)) {
            const cleanedUrl = actualUrl.replace(/\s/g, '')
            setActualUrl(cleanedUrl)
          } else {
            onError?.(err as Error)
          }
        }}
        trustAllCerts={Platform.select({ android: false, ios: undefined })}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        {...extraProps}
      />
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.url === nextProps.url) {
      return true
    }
    return false
  },
)
