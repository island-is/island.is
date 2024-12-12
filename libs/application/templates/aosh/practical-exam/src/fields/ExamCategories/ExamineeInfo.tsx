import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

type ExamineeInfoProps = {
  examinee: unknown
}

export const ExamineeInfo: FC<
  React.PropsWithChildren<FieldBaseProps & ExamineeInfoProps>
> = (props) => {
  // Display two read-only fields: Name and SSN
  return <div></div>
}
