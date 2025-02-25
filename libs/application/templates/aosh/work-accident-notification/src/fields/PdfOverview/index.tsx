import { usePDF } from '@react-pdf/renderer'
import { Box, Button, PdfViewer, TopicCard } from '@island.is/island-ui/core'
import { PdfDocument } from './pdfDocument'
import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import * as styles from './PdfOverview.css'
import { conclusion } from '../../lib/messages'

export const PdfOverview: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()
  const [fileToView, setFileToView] = useState<string | undefined>(undefined)
  const [base64Document, setBase64Document] = useState<string | undefined>(
    undefined,
  )
  const [document] = usePDF({
    document: <PdfDocument formatMessage={formatMessage} {...props} />,
  })

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = () => {
        reject(new Error('Failed to convert blob to base64'))
      }
    })
  }

  useEffect(() => {
    document.blob &&
      blobToBase64(document.blob)
        .then((base64) => {
          if (typeof base64 === 'string') setBase64Document(base64)
        })
        .catch((error) => {
          console.error('Failed to convert PDF to base64:', error)
        })
  }, [document])

  const isNotValid = () => {
    const lastModified = new Date(
      application.externalData.submitApplication.date,
    )
    const dateNow = new Date()
    lastModified.setMinutes(lastModified.getMinutes() + 30)
    return lastModified < dateNow
  }

  if (isNotValid()) {
    return null
  }

  if (fileToView && document.url) {
    return (
      <>
        <Box
          display="flex"
          marginBottom={5}
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <Button
            circle
            icon="arrowBack"
            onClick={() => {
              setFileToView(undefined)
            }}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={document.url}
            download={'Slysatilkynning.pdf'}
            className={styles.linkWithoutDecorations}
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatMessage(conclusion.pdfOverview.download)}
            </Button>
          </a>
        </Box>

        <PdfViewer file={fileToView} />
      </>
    )
  }

  return (
    <Box marginBottom={2}>
      <TopicCard
        onClick={() => {
          base64Document && setFileToView(base64Document)
        }}
        tag="PDF"
        colorScheme="blue"
      >
        {formatMessage(conclusion.pdfOverview.pdfName)}
      </TopicCard>
    </Box>
  )
}
