import { FC, ReactNode } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'

interface LabelValueProps {
  label: string | ReactNode
  value: string | ReactNode
  marginBottom?: ResponsiveProp<Space | 'auto'>
}

export const LabelValue: FC<LabelValueProps> = ({
  label,
  value,
  marginBottom = 0,
}) => {
  return (
    <Box marginBottom={marginBottom}>
      <Text as="span" fontWeight="semiBold">
        {label}:{' '}
      </Text>
      <Text as="span">{value}</Text>
    </Box>
  )
}

export default LabelValue
