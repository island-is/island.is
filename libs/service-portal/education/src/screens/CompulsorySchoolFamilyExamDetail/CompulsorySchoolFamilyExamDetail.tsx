import { ActionCard, IntroHeader, m } from '@island.is/service-portal/core'
import { useFamilySchoolCareerQueryQuery } from './CompulsorySchoolFamilyExamOverview.generated'
import { EducationCompulsorySchoolStudentCareer } from '@island.is/api/schema'
import { compulsorySchoolMessages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Box } from '@island.is/island-ui/core'

export const CompulsorySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-student-assessment')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useFamilySchoolCareerQueryQuery()

  const userCareer: EducationCompulsorySchoolStudentCareer | null =
    data?.userFamilyExamResults.userCareer ?? null

  return (
    <>
      <IntroHeader
        title={formatMessage(compulsorySchoolMessages.assessment)}
        intro={formatMessage(
          compulsorySchoolMessages.studentAssessmentIntroText,
        )}
        serviceProviderSlug={'menntamalastofnun'}
        serviceProviderTooltip={formatMessage(m.mmsTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !userCareer && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {userCareer && !loading && !error && (
        <Box>
          <ActionCard
            image={{ type: 'avatar' }}
            translateLabel="no"
            heading={userCareer.name}
            text={`${formatMessage(compulsorySchoolMessages.examDateSpan)}: ${
              userCareer.examDateSpan
            }`}
            tag={{
              label: formatMessage(compulsorySchoolMessages.studentAssessment),
              variant: 'purple',
            }}
            cta={{
              label: formatMessage(m.seeDetails),
              variant: 'text',
              url: 'eghjeaio',
            }}
          />
        </Box>
      )}
    </>
  )
}

export default CompulsorySchoolFamilyExamOverview
