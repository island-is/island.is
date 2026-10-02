import { useMemo } from 'react'

import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  createColumnHelper,
  formatDateWithTime,
  PortalTable,
} from '@island.is/portals/my-pages/core'

import { messages as m } from '../../lib/messages'
import { AirDiscountFlightLegsQuery } from '../../screens/AirDiscountOverview/AirDiscountOverview.generated'

type FlightLeg =
  AirDiscountFlightLegsQuery['airDiscountSchemeUserAndRelationsFlights'][number]

interface PropTypes {
  data: FlightLeg[]
}

const columnHelper = createColumnHelper<FlightLeg>()

const UsageTable = ({ data }: PropTypes) => {
  const { formatMessage } = useLocale()
  const columns = useMemo(
    () => [
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
    ],
    [formatMessage],
  )
  return (
    <Box marginBottom={4}>
      <PortalTable
        columns={columns}
        data={data}
        emptyMessage=""
        mobileTitleKey="user"
      />
    </Box>
  )
}

export default UsageTable
