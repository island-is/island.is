import { Box, Button, Divider, Drawer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import PdfReport from '../../../../shared/PdfReport'
import { m } from '../../../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

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
        <Box display={["block", "block", "flex"]} justifyContent="spaceBetween" marginBottom={10}>
          <Box marginBottom={[2, 2, 0]}>
            <Text variant="h4">{formatMessage(m.downloadPdf)}</Text>
            <Text>{formatMessage(m.downloadPdfDescription)}</Text>
          </Box>
          <PdfReport listId={listId} collectionType={collectionType} />
        </Box>
        <Box display={["block", "block", "flex"]} justifyContent="spaceBetween">
          <Box marginBottom={[2, 2, 0]}>
            <Text variant="h4">{formatMessage(m.deleteCollection)}</Text>
            <Text>{formatMessage(m.deleteCollectionDescription)}</Text>
          </Box>
          <Button
            iconType="outline"
            variant="ghost"
            icon="trash"
            colorScheme="destructive"
          >
            {formatMessage(m.deleteCollection)}
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default ListActions
