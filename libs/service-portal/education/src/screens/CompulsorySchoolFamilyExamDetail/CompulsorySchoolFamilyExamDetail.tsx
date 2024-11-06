import { ActionCard, IntroHeader, m } from '@island.is/service-portal/core'
import { EducationCompulsorySchoolStudentCareer } from '@island.is/api/schema'
import { compulsorySchoolMessages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Box } from '@island.is/island-ui/core'
import { useParams } from 'react-router-dom'
import { useUserFamilyMemberExamResultsQuery } from './CompulsorySchoolFamilyExamDetail.generated'

type UseParams = {
  id: string
}

export const CompulsorySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-student-assessment')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useUserFamilyMemberExamResultsQuery({
    variables: {
      input: {
        maskedId: id,
      },
    },
  })

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
      {!error && !loading && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      <p>bleble</p>
    </>
  )
}

export default CompulsorySchoolFamilyExamOverview
