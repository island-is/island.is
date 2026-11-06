import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { DrivingBookLesson } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/portals/my-pages/assets/messages'
import {
  createColumnHelper,
  formatDate,
  PortalTable,
} from '@island.is/portals/my-pages/core'

interface PropTypes {
  data: DrivingBookLesson[]
  title: string
}

const PhysicalLessons = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const columnHelper = createColumnHelper<DrivingBookLesson>()
  const columns = [
    columnHelper.accessor('registerDate', {
      header: formatMessage(messages.date),
      cell: ({ getValue }) => (getValue() ? formatDate(getValue()) : ''),
      enableSorting: false,
    }),
    columnHelper.accessor('lessonTime', {
      header: formatMessage(messages.vehicleDrivingLessonsMinuteCount),
      enableSorting: false,
    }),
    columnHelper.accessor('teacherName', {
      header: formatMessage(messages.vehicleDrivingLessonsTeacher),
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
        mobileTitleKey="registerDate"
      />
    </Box>
  )
}

export default PhysicalLessons
