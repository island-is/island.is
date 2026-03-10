import { ActionCard, CardLoader, IntroWrapper, m, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Stack } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { generatePath } from 'react-router-dom'
import { EducationPaths } from '../../lib/paths'
import { primarySchoolMessages as psm } from '../../lib/messages'
import { usePrimarySchoolStudentsQuery } from './PrimarySchool.generated'

export const PrimarySchool = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { data, loading, error } = usePrimarySchoolStudentsQuery()

  const students = data?.primarySchoolStudents ?? []

  return (
    <IntroWrapper
      title={psm.studentListTitle}
      intro={psm.studentListIntro}
      serviceProviderSlug={MMS_SLUG}
    >
      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !students.length && (
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
      <Stack space={2}>
        {students.map((student) => (
          <ActionCard
            key={student.id}
            heading={student.name ?? ''}
            text={student.nationalId ?? ''}
            tag={
              student.relationType
                ? {
                    label: student.relationType,
                    variant: 'blue',
                    outlined: true,
                  }
                : undefined
            }
            image={{ type: 'avatar' }}
            cta={{
              label: formatMessage(psm.studentListCta),
              variant: 'text',
              url: generatePath(EducationPaths.PrimarySchoolStudent, {
                studentId: student.id,
              }),
            }}
          />
        ))}
      </Stack>
    </IntroWrapper>
  )
}

export default PrimarySchool
