import {
  CardLoader,
  formatNationalId,
  IntroWrapper,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard, Box, Stack } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { generatePath, useNavigate } from 'react-router-dom'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolStudentsQuery } from './PrimarySchool.generated'
import { EducationPrimarySchoolContactType } from '@island.is/api/schema'

export const PrimarySchool = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { data, loading, error } = usePrimarySchoolStudentsQuery()

  const students = data?.primarySchoolStudents ?? []

  return (
    <IntroWrapper
      title={psm.schoolLabel}
      intro={psm.studentListIntro}
      serviceProvider={{
        slug: MMS_SLUG,
        tooltip: formatMessage(m.mmsTooltip),
      }}
    >
      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !students.length && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(psm.assessmentNoData)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      <Stack space={2}>
        {students.map((student) => (
          <ActionCard
            key={student.id}
            heading={student.name ?? ''}
            headingVariant="h4"
            text={
              student.nationalId
                ? `${formatMessage(m.natreg)}: ${formatNationalId(
                    student.nationalId,
                  )}`
                : undefined
            }
            avatar
            tag={
              student.contactType === EducationPrimarySchoolContactType.GUARDIAN
                ? {
                    label: formatMessage(psm.child),
                    variant: 'purple',
                    outlined: true,
                  }
                : undefined
            }
            cta={{
              label: formatMessage(psm.studentListCta),
              variant: 'text',
              onClick: () =>
                navigate(
                  generatePath(EducationPaths.PrimarySchoolStudent, {
                    studentId: student.id ?? null,
                  }),
                ),
            }}
          />
        ))}
      </Stack>
    </IntroWrapper>
  )
}

export default PrimarySchool
