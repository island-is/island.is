import { Accordion } from '@island.is/island-ui/core'
import { AssessmentAccordionItem } from './AssessmentAccordionItem'

interface Assessment {
  id: string
  name?: string | null
}

interface Props {
  assessmentHistory: Assessment[]
  studentId: string
}

export const AssessmentAccordionList = ({
  assessmentHistory,
  studentId,
}: Props) => {
  return (
    <Accordion dividerOnTop={false} space={3}>
      {assessmentHistory.map((assessment) => {
        if (!assessment.id) return null
        return (
          <AssessmentAccordionItem
            key={assessment.id}
            id={assessment.id}
            name={assessment.name ?? ''}
            studentId={studentId}
          />
        )
      })}
    </Accordion>
  )
}
