import { CardLoader } from '@island.is/portals/my-pages/core'
import { Accordion, AccordionItem } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { AssessmentTable } from '../AssessmentTable'
import { usePrimarySchoolAssessmentResultsQuery } from '../PrimarySchoolAssessment.generated'

interface Props {
  assessmentId: string
  name: string
  studentId: string
}

export const SingleAssessment = ({ assessmentId, name, studentId }: Props) => {
  const { data, loading, error } = usePrimarySchoolAssessmentResultsQuery({
    variables: { studentId, assessmentId },
  })

  const results =
    data?.primarySchoolStudent?.assessmentHistory?.[0]?.resultHistory ?? []

  return (
    <Accordion dividerOnTop={false} space={3}>
      <AccordionItem startExpanded id={assessmentId} label={name}>
        {loading && <CardLoader />}
        {error && <Problem error={error} noBorder={false} />}
        {!loading && !error && <AssessmentTable results={results} />}
      </AccordionItem>
    </Accordion>
  )
}
