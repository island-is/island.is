import { Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useGetCollectors } from '../../../hooks'
import { m } from '../../../lib/messages'
import { formatNationalId } from '@island.is/portals/core'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionCollector,
} from '@island.is/api/schema'
import { Markdown } from '@island.is/shared/components'
import {
  createColumnHelper,
  PortalTable,
} from '@island.is/portals/my-pages/core'

const columnHelper = createColumnHelper<SignatureCollectionCollector>()

const Managers = ({
  collectionType,
}: {
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { collectors, loadingCollectors } = useGetCollectors(collectionType)
  const columns = [
    columnHelper.accessor('nationalId', {
      header: formatMessage(m.personNationalId),
      cell: ({ getValue }) => formatNationalId(getValue()),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      header: formatMessage(m.personName),
      enableSorting: false,
    }),
  ]

  return (
    <Box>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(m.managers)}
      </Text>
      <Box marginBottom={3}>
        <Markdown>{formatMessage(m.managersDescription)}</Markdown>
      </Box>
      <PortalTable
        columns={columns}
        data={collectors}
        loading={loadingCollectors}
        emptyMessage={formatMessage(m.noManagers)}
        getRowId={(collector) => collector.nationalId}
        mobileTitleKey="name"
      />
    </Box>
  )
}

export default Managers
