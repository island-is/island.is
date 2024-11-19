import { Box, Text } from '@island.is/island-ui/core'
import { NestedLines } from '@island.is/portals/my-pages/core'
import React from 'react'

interface Props {
  label?: string
  data: {
    title: string
    value?: string | number | React.ReactElement
    type?: 'text' | 'link'
    href?: string
  }[]
  width?: 'full' | 'half'
}

const NestedInfoLines: React.FC<Props> = ({ label, data, width = 'full' }) => {
  return (
    <>
      {label && (
        <Box paddingLeft={2}>
          <Text variant="small" fontWeight="medium">
            {label}
          </Text>
        </Box>
      )}
      <NestedLines data={data} width={width} />
    </>
  )
}

export default NestedInfoLines
