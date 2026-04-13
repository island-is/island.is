import {
  CardLoader,
  InfoLine,
  InfoLineStack,
  m,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolStudentOverviewQuery } from './PrimarySchoolStudentOverview.generated'

export const PrimarySchoolOverview = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolStudentOverviewQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const student = data?.primarySchoolStudent

  return (
    <>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !student && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      {!loading && !error && student && (
        <InfoLineStack label={formatMessage(psm.basicInfo)}>
          <InfoLine
            label={psm.studentLabel}
            content={student.name ?? undefined}
            loading={loading}
          />
          <InfoLine
            label={psm.schoolLabel}
            content={student.schoolName ?? undefined}
            loading={loading}
          />
          <InfoLine
            label={psm.contactTeacher}
            content={student.contactTeacherName ?? undefined}
            loading={loading}
          />
          <InfoLine
            label={psm.homeRoom}
            content={student.homeRoomName ?? undefined}
            loading={loading}
          />
        </InfoLineStack>
      )}
    </>
  )
}

export default PrimarySchoolOverview
