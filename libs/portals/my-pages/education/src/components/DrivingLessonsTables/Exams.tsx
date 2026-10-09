import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { DrivingLicenceTestResult } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/portals/my-pages/assets/messages'
import {
  createColumnHelper,
  formatDate,
  PortalTable,
} from '@island.is/portals/my-pages/core'

interface PropTypes {
  data: DrivingLicenceTestResult[]
  title: string
}

const Exams = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const columnHelper = createColumnHelper<DrivingLicenceTestResult>()
  const columns = [
    columnHelper.accessor('examDate', {
      header: formatMessage(messages.date),
      cell: ({ getValue }) => (getValue() ? formatDate(getValue()) : ''),
      enableSorting: false,
    }),
    columnHelper.accessor('testTypeName', {
      header: formatMessage(messages.vehicleDrivingLessonsExam),
      enableSorting: false,
    }),
    columnHelper.accessor('hasPassed', {
      header: formatMessage(messages.vehicleDrivingLessonsHasPassed),
      cell: ({ getValue }) =>
        formatMessage(getValue() ? messages.yes : messages.no),
      enableSorting: false,
    }),
  ]
  return (
    <Box marginBottom={4} marginTop="containerGutter">
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {title}
      </Text>
      <PortalTable
        columns={columns}
        data={data ?? []}
        emptyMessage=""
        mobileTitleKey="testTypeName"
      />
    </Box>
  )
}

export default Exams
