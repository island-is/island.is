import { FC, isValidElement, ReactNode } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'

import RequiredStar from '../RequiredStar/RequiredStar'

interface Props {
  title: string
  required?: boolean
  tooltip?: ReactNode
  description?: ReactNode | string
  marginBottom?: ResponsiveProp<Space | 'auto'>
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
}

const SectionHeading: FC<Props> = ({
  title,
  required,
  tooltip,
  description,
  marginBottom = 3,
  heading = 'h3',
}) => (
  <Box marginBottom={marginBottom}>
    <Text as={heading} variant={heading}>
      {title}
      {required && ' '}
      {required && <RequiredStar />}
      {tooltip && ' '}
      {tooltip && <Box component="span">{tooltip}</Box>}
    </Text>
    {description && (
      <Box component="span" marginTop={1}>
        {isValidElement(description) ? (
          description
        ) : (
          <Text marginTop={2}>{description}</Text>
        )}
      </Box>
    )}
  </Box>
)

export default SectionHeading
