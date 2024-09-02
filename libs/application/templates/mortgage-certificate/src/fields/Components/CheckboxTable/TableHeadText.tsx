import { FC } from 'react'
import { Text } from '@island.is/island-ui/core'

export const TableHeadText: FC<React.PropsWithChildren<{ text: string }>> = ({
  text,
}) => {
  return (
    <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
      {text}
    </Text>
  )
}
