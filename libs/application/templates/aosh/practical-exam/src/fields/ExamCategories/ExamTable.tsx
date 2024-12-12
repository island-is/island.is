import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

type ExamTableProps = {
  examAssignments: unknown // Whatever should be displayed in the table
}

export const ExamTable: FC<
  React.PropsWithChildren<FieldBaseProps & ExamTableProps>
> = (props) => {
  return <div></div>
}
