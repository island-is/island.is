import { InfoLine, m } from '@island.is/portals/my-pages/core'
import { Divider } from '@island.is/island-ui/core'

import { primarySchoolMessages as psm } from '../../../../lib/messages'
import { KeyInfoSection } from './KeyInfoSection'
import type { PrimarySchoolStudentOverviewQuery } from '../PrimarySchoolStudentOverview.generated'

type Student = NonNullable<
  PrimarySchoolStudentOverviewQuery['primarySchoolStudent']
>

interface Props {
  student: Student
  loading: boolean
}

/**
 * Grunnupplýsingar — base student info (school, contact teacher, home room).
 * Read-only; no MMS key-info endpoint behind it. Kept as a section component so
 * it matches the other Lykilupplýsingar sections on the overview.
 */
export const BaseInfoSection = ({ student, loading }: Props) => {
  return (
    <KeyInfoSection title={m.baseInfo}>
      <Divider />
      <InfoLine
        label={psm.schoolLabel}
        content={student.schoolName ?? undefined}
        loading={loading}
        paddingY={3}
        button={{
          type: 'action',
          label: psm.changeSchool,
          icon: 'arrowForward',
          // TODO: link to the school-enrollment application (umsókn) once known.
          action: () => console.log('Link to umsokn'),
        }}
      />
      <Divider />
      <InfoLine
        label={psm.contactTeacher}
        content={student.contactTeacherName ?? undefined}
        loading={loading}
        paddingY={3}
      />
      <Divider />
      <InfoLine
        label={psm.homeRoom}
        content={student.homeRoomName ?? undefined}
        loading={loading}
        paddingY={3}
      />
      <Divider />
    </KeyInfoSection>
  )
}

export default BaseInfoSection
