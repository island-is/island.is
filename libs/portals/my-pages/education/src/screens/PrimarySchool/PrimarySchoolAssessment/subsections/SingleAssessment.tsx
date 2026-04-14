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

  if (loading && !error) return <CardLoader />
  if (error && !loading) return <Problem error={error} noBorder={false} />

  return (
    <Accordion dividerOnTop={false} dividerOnBottom={false} space={3}>
      <AccordionItem startExpanded id={assessmentId} label={name}>
        <AssessmentTable results={results} />
      </AccordionItem>
    </Accordion>
  )
}
