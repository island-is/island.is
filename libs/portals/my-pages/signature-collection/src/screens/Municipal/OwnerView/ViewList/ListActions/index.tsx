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
import { SignatureCollectionList } from '@island.is/api/schema'
import CancelCollection from '../../../../shared/cancelCollection'

const ListActions = ({ list }: { list: SignatureCollectionList }) => {
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
        <Text variant="h2" marginY={5}>
          {formatMessage(m.listActions)}
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
              <PdfReport
                listId={list.id}
                collectionType={list.collectionType}
              />
            </Box>
          </Box>
          <CancelCollection list={list} />
        </Stack>
      </Drawer>
      <Box marginTop={3}>
        <Divider />
      </Box>
    </Box>
  )
}

export default ListActions
