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
import { m } from '../../../../lib/messages'
import CancelCandidacy from '../CancelCandidacy'
import { PdfReport } from '../../../shared/PdfReport'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const ActionDrawer = ({
  candidateId,
  collectionType,
}: {
  candidateId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
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
            <Box marginLeft={3}>
              <Text variant="h4">{formatMessage(m.pdfReport)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.pdfReportDescription)}
              </Text>
              <PdfReport
                candidateId={candidateId}
                collectionType={collectionType}
              />
            </Box>
          </Box>
          <CancelCandidacy />
        </Stack>
      </Drawer>
      <Box marginTop={3}>
        <Divider />
      </Box>
    </Box>
  )
}

export default ActionDrawer
