import { memo } from 'react'
import { Platform } from 'react-native'
import Pdf, { Source } from 'react-native-pdf'

interface PdfViewerProps {
  url: string
  body: string
  onLoaded: (path: string) => void
  onError: (err: Error) => void
}

export const PdfViewer = memo(
  ({ url, body, onLoaded, onError }: PdfViewerProps) => {
    const extraProps = {
      activityIndicatorProps: {
        color: '#0061ff',
        progressTintColor: '#ccdfff',
      },
    }

    return (
      <Pdf
        spacing={0}
        source={
          {
            uri: url,
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body,
            method: 'POST',
          } as Source
        }
        onLoadComplete={(_, filePath) => {
          onLoaded?.(filePath)
        }}
        onError={(err) => {
          onError?.(err as Error)
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
    if (prevProps.url === nextProps.url && prevProps.body === nextProps.body) {
      return true
    }
    return false
  },
)
