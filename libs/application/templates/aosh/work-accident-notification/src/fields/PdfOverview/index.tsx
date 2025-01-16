import { usePDF } from '@react-pdf/renderer'
import { Box, Button, PdfViewer, TopicCard } from '@island.is/island-ui/core'
import { PdfDocument } from './pdfDocument'
import { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import * as styles from './PdfOverview.css'

export const PdfOverview: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()
  const [fileToView, setFileToView] = useState<string | undefined>(undefined)
  const [document] = usePDF({
    document: <PdfDocument formatMessage={formatMessage} {...props} />,
  })

  const isNotValid = () => {
    const lastModified = new Date(application.modified)
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
              {'Hlaða niður'}
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
          document.url && setFileToView(document.url)
        }}
        tag="PDF"
        colorScheme="blue"
      >
        {'Tilkynning um vinnuslys'}
      </TopicCard>
    </Box>
  )
}
