import {
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
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

        <Stack space={8}>
          <Box display="flex">
            <Box marginTop={1}>
              <Tag>
                <Box display="flex" justifyContent="center">
                  <Icon icon="document" type="outline" color="blue600" />
                </Box>
              </Tag>
            </Box>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.pdfReport)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.pdfReportDescription)}
              </Text>
              <PdfReport listId={listId} collectionType={collectionType} />
            </Box>
          </Box>
          <CancelCollection listId={listId} />
        </Stack>
      </Drawer>
    </Box>
  )
}

export default ListActions
