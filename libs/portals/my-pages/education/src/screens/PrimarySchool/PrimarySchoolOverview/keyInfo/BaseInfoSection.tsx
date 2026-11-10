import { InfoLine, m } from '@island.is/portals/my-pages/core'
import { Divider } from '@island.is/island-ui/core'

import type { EducationPrimarySchoolStudent } from '@island.is/api/schema'
import { primarySchoolMessages as psm } from '../../../../lib/messages'
import { KeyInfoSection } from './KeyInfoSection'

interface Props {
  /** Only the fields this section renders, so the overview can pass its own
   * narrower query result. */
  student: Pick<
    EducationPrimarySchoolStudent,
    'schoolName' | 'contactTeacherName' | 'homeRoomName'
  >
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
          type: 'link',
          label: psm.changeSchool,
          // Leaves Mínar síður for the application system. The origin makes it
          // an absolute url, which LinkResolver opens as an external link —
          // a relative path would be routed inside this SPA instead.
          to: `${document.location.origin}/umsoknir/grunnskoli`,
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
