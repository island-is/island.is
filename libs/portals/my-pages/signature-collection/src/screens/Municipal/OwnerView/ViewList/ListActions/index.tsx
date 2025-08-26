import { Box, Button, Divider, Drawer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import PdfReport from '../../../../shared/PdfReport'
import { m } from '../../../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import CancelCollection from '../../../../shared/cancelCollection'

const collectionType = SignatureCollectionCollectionType.LocalGovernmental

const ListActions = ({ listId }: { listId: string }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3} marginBottom={5}>
      <Drawer
        ariaLabel="listActions"
        baseId="listActions"
        disclosure={
          <Button variant="utility" icon="settings" iconType="outline">
            {formatMessage(m.listActions)}
          </Button>
        }
      >
        <Text variant="h2" color="backgroundBrand" marginY={3}>
          {formatMessage(m.listActions)}
        </Text>
        <Divider />
        <Text marginTop={6} marginBottom={8}>
          {formatMessage(m.listActionsDescription)}
        </Text>
        <Box
          display={['block', 'block', 'flex']}
          justifyContent="spaceBetween"
          marginBottom={10}
        >
          <Box marginBottom={[2, 2, 0]}>
            <Text variant="h4">{formatMessage(m.downloadPdf)}</Text>
            <Text>{formatMessage(m.downloadPdfDescription)}</Text>
          </Box>
          <PdfReport listId={listId} collectionType={collectionType} />
        </Box>
        <CancelCollection listId={listId} />
      </Drawer>
    </Box>
  )
}

export default ListActions
