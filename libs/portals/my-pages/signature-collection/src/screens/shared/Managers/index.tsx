import { Text, Box, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useGetCollectors } from '../../../hooks'
import { m } from '../../../lib/messages'
import { CollectorSkeleton } from '../../../lib/skeletons'
import { formatNationalId } from '@island.is/portals/core'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const Managers = ({
  collectionType,
}: {
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { collectors, loadingCollectors } = useGetCollectors(collectionType)

  return (
    <Box>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(m.managers)}
      </Text>
      <Text marginBottom={5}>{formatMessage(m.managersDescription)}</Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.personNationalId)}</T.HeadData>
            <T.HeadData>{formatMessage(m.personName)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {loadingCollectors ? (
            <T.Row>
              <T.Data width="25%">
                <CollectorSkeleton />
              </T.Data>
              <T.Data>
                <CollectorSkeleton />
              </T.Data>
            </T.Row>
          ) : collectors.length ? (
            collectors.map((collector) => (
              <T.Row key={collector.nationalId}>
                <T.Data width="25%">
                  {formatNationalId(collector.nationalId)}
                </T.Data>
                <T.Data>{collector.name}</T.Data>
              </T.Row>
            ))
          ) : (
            <Text marginTop={2}>{formatMessage(m.noManagers)}</Text>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default Managers
