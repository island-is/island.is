import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  createColumnHelper,
  formatDateWithTime,
  PortalTable,
} from '@island.is/portals/my-pages/core'

import { messages as m } from '../../lib/messages'
import { AirDiscountFlightLegsQuery } from '../../screens/AirDiscountOverview/AirDiscountOverview.generated'

type FlightLeg = AirDiscountFlightLegsQuery['airDiscountSchemeUserAndRelationsFlights'][number]

interface PropTypes {
  data: FlightLeg[]
}

const UsageTable = ({ data }: PropTypes) => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  const columnHelper = createColumnHelper<FlightLeg>()
  const columns = [
    columnHelper.accessor((row) => row.flight.user.name, {
      id: 'user',
      header: formatMessage(m.user),
      enableSorting: false,
    }),
    columnHelper.accessor('travel', {
      header: formatMessage(m.flight),
      enableSorting: false,
    }),
    columnHelper.accessor((row) => row.flight.bookingDate, {
      id: 'date',
      header: formatMessage(m.date),
      cell: ({ getValue }) =>
        getValue() ? formatDateWithTime(getValue()) : '',
      enableSorting: false,
    }),
  ]
  return (
    <Box marginBottom={4}>
      <PortalTable
        columns={columns}
        data={data ?? []}
        emptyMessage=""
        mobileTitleKey="user"
      />
    </Box>
  )
}

export default UsageTable
