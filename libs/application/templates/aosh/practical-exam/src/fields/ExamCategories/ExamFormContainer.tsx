import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'

type ExamAssignmentFormProps = {
  exams: unknown // Potentially from answers
  instructors: unknown // Potentially from props/application
  onSaveAndNext: () => void
}

export const ExamFormContainer: FC<
  React.PropsWithChildren<FieldBaseProps & ExamAssignmentFormProps>
> = (props) => {
  const [selectedExam, setSelectedExam] = useState<unknown>(null)
  const [examInstructors, setExamInstructors] = useState<unknown>(null)

  return <div></div>
}
