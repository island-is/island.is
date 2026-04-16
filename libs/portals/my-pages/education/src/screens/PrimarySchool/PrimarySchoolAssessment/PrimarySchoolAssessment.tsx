import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { usePrimarySchoolAssessmentDataQuery } from './PrimarySchoolAssessment.generated'
import { SingleAssessment } from './subsections/SingleAssessment'
import { AssessmentAccordionList } from './subsections/AssessmentAccordionList'

export const PrimarySchoolAssessment = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolAssessmentDataQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const assessmentHistory = data?.primarySchoolStudent?.assessmentHistory ?? []

  if (loading && !error) return <CardLoader />
  if (error && !loading) return <Problem error={error} noBorder={false} />

  if (!assessmentHistory.length) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(m.noData)}
        message={formatMessage(m.noDataFoundDetail)}
        imgSrc="./assets/images/sofa.svg"
      />
    )
  }

  if (assessmentHistory.length === 1 && assessmentHistory[0].id) {
    return (
      <SingleAssessment
        assessmentId={assessmentHistory[0].id}
        name={assessmentHistory[0].name ?? ''}
        studentId={studentId ?? ''}
      />
    )
  }

  return (
    <AssessmentAccordionList
      assessmentHistory={assessmentHistory}
      studentId={studentId ?? ''}
    />
  )
}

export default PrimarySchoolAssessment
