import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'

export const ExamCategories: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const [examinees, setExaminees] = useState<[]>([]) // From answers
  const [examineeIndex, setExamineeIndex] = useState<number>(0) // From answers
  const [examAssignments, setExamAssignments] = useState<[]>([]) // From answers

  return (
    <div>
      {/* <ExamTable */}
      {/* <ExamineeInfo /> */}
      {/* <ExamAssignmentForm /> */}
    </div>
  )
}
