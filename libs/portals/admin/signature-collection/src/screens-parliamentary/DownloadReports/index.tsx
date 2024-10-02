import { useLocale } from '@island.is/localization'
import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { SignatureCollectionArea } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './MyPdfDocument'

export const DownloadReports = ({
  areas,
}: {
  areas: SignatureCollectionArea[]
}) => {
  const { formatMessage } = useLocale()
  const [modalDownloadReportsIsOpen, setModalDownloadReportsIsOpen] =
    useState(false)

  const [document] = usePDF({
    document: <MyPdfDocument report={{}} />,
  })

  return (
    <Box>
      <Button
        icon="download"
        iconType="outline"
        variant="utility"
        size="small"
        onClick={() => setModalDownloadReportsIsOpen(true)}
      >
        {formatMessage(m.downloadReports)}
      </Button>
      <Modal
        id="downloadReports"
        isVisible={modalDownloadReportsIsOpen}
        title={formatMessage(m.downloadReports)}
        label={''}
        onClose={() => setModalDownloadReportsIsOpen(false)}
        closeButtonLabel={''}
      >
        <Text>{formatMessage(m.downloadReportsDescription)}</Text>
        <Box marginY={5}>
          <Stack space={3}>
            {areas.map((area) => (
              <ActionCard
                key={area.id}
                heading={formatMessage(area.name)}
                headingVariant="h4"
                backgroundColor="blue"
                cta={{
                  label: formatMessage(m.downloadButton),
                  variant: 'text',
                  icon: 'download',
                  iconType: 'outline',
                  onClick: () => {
                    window.open(document.url ?? '', '_blank')
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

export default DownloadReports
