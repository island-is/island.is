import { Field, FieldBaseProps } from '@island.is/application/types'
import { FC, PropsWithChildren } from 'react'

import { Answers } from '../../types'
import DeceasedShare, {
  DeceasedShareProps,
} from '../../components/DeceasedShare'

export const DeceasedShareField: FC<
  PropsWithChildren<FieldBaseProps<Answers>>
> = (data) => {
  const props =
    (data?.field as Field & { props: DeceasedShareProps })?.props ?? null

  if (!props) {
    return null
  }

  return <DeceasedShare {...props} />
}

export default DeceasedShareField
