import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Accordion, AccordionItem } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolAssessmentDataQuery } from './PrimarySchoolAssessment.generated'
import { AssessmentTable } from './AssessmentTable'

export const PrimarySchoolAssessment = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolAssessmentDataQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const assessmentHistory = data?.primarySchoolStudent?.assessmentHistory ?? []

  return (
    <>
      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && !assessmentHistory.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!loading && !error && assessmentHistory.length > 0 && (
        <Accordion dividerOnTop={false} space={3}>
          {assessmentHistory.map((assessment) => {
            if (!assessment.id) return null
            return (
              <AccordionItem
                startExpanded={assessmentHistory.length === 1}
                key={assessment.id}
                id={assessment.id}
                label={assessment.name ?? ''}
              >
                <AssessmentTable results={assessment.resultHistory ?? []} />
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </>
  )
}

export default PrimarySchoolAssessment
