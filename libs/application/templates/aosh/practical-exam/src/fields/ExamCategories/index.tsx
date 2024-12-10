import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'

export const ExamCategories: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const [examinees, setExaminees] = useState<[]>([]) // From answers
  const [instructors, setInstructors] = useState<[]>([]) // From answers
  const [index, setIndex] = useState<number>(0) // From answers

  return (
    <div>
      {/* <Table /> */}
      {/* <ExamineesExamCateogry */}
    </div>
  )
}
