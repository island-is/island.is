import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { DrivingSchoolExam } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/portals/my-pages/assets/messages'
import {
  createColumnHelper,
  formatDate,
  PortalTable,
} from '@island.is/portals/my-pages/core'

interface PropTypes {
  data: DrivingSchoolExam[]
  title: string
}

const DrivingLessonsSchools = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const columnHelper = createColumnHelper<DrivingSchoolExam>()
  const columns = [
    columnHelper.accessor('examDate', {
      header: formatMessage(messages.date),
      cell: ({ getValue }) => (getValue() ? formatDate(getValue()) : ''),
      enableSorting: false,
    }),
    columnHelper.accessor('schoolTypeName', {
      header: formatMessage(messages.vehicleDrivingLessonsCourseTitle),
      enableSorting: false,
    }),
    columnHelper.accessor('schoolName', {
      header: formatMessage(messages.vehicleDrivingLessonsSchool),
      enableSorting: false,
    }),
    columnHelper.accessor('comments', {
      header: formatMessage(messages.vehicleDrivingLessonsComments),
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
        mobileTitleKey="schoolTypeName"
      />
    </Box>
  )
}

export default DrivingLessonsSchools
