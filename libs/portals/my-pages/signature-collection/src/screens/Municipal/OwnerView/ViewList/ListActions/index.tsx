import { Box, Button, Divider, Drawer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import PdfReport from '../../../../shared/PdfReport'
import { m } from '../../../../../lib/messages'

const ListActions = () => {
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
        <Box display="flex" justifyContent="spaceBetween" marginBottom={10}>
          <Box>
            <Text variant="h4">{formatMessage(m.downloadPdf)}</Text>
            <Text>{formatMessage(m.downloadPdfDescription)}</Text>
          </Box>
          <PdfReport listId="1" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
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
