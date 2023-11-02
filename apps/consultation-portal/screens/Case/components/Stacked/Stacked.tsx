import { Stack, Text } from '@island.is/island-ui/core'
import { ReactNode } from 'react'

interface Props {
  headingColor?: 'blue400' | 'blue600' | 'dark400'
  title: string
  children: ReactNode
}

const Stacked = ({ headingColor = 'blue400', title, children }: Props) => {
  return (
    <Stack space={1}>
      <Text variant="h4" color={headingColor}>
        {title}
      </Text>
      {children}
    </Stack>
  )
}

export default Stacked
