import type { FC, ReactNode } from 'react'

import type { ResponsiveProp, Space } from '@island.is/island-ui/core'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import RequiredStar from '@island.is/judicial-system-web/src/components/RequiredStar/RequiredStar'

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

interface Props {
  title: string
  required?: boolean
  tooltip?: ReactNode
  description?: ReactNode | string
  marginBottom?: ResponsiveProp<Space | 'auto'>
  heading?: Heading
  variant?: Heading
  marginTop?: ResponsiveProp<Space | 'auto'>
}

const SectionHeading: FC<Props> = ({
  title,
  required,
  tooltip,
  description,
  marginBottom = 3,
  heading = 'h3',
  variant = 'h3',
  marginTop = 0,
}) => (
  <Box marginBottom={marginBottom} marginTop={marginTop}>
    <Text as={heading} variant={variant}>
      {title}
      {required && ' '}
      {required && <RequiredStar />}
      {tooltip && ' '}
      {tooltip && typeof tooltip === 'string' ? (
        <Tooltip text={tooltip} />
      ) : (
        tooltip
      )}
    </Text>
    {description && (
      <Box component="span" display="inlineBlock" marginTop={1}>
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
