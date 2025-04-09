import { FC, ReactNode } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'

import RequiredStar from '../RequiredStar/RequiredStar'

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

interface Props {
  title: string
  required?: boolean
  tooltip?: ReactNode
  description?: ReactNode | string
  marginBottom?: ResponsiveProp<Space | 'auto'>
  heading?: Heading
  variant?: Heading
}

const SectionHeading: FC<Props> = ({
  title,
  required,
  tooltip,
  description,
  marginBottom = 3,
  heading = 'h3',
  variant = 'h3',
}) => (
  <Box marginBottom={marginBottom}>
    <Text as={heading} variant={variant}>
      {title}
      {required && ' '}
      {required && <RequiredStar />}
      {tooltip && ' '}
      {tooltip && <Box component="span">{tooltip}</Box>}
    </Text>
    {description && (
      <Box component="span" marginTop={1}>
        {typeof description === 'string' ? (
          <Text>{description}</Text>
        ) : (
          description
        )}
      </Box>
    )}
  </Box>
)

export default SectionHeading
