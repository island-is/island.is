import { Box, Tag } from '@island.is/island-ui/core'
import React from 'react'

const PoliceCaseNumbersTags: React.FC<{ policeCaseNumbers: string[] }> = ({
  policeCaseNumbers,
}) => (
  <Box marginBottom={5} display="flex" flexWrap="wrap">
    {policeCaseNumbers.map((policeCaseNumber, index) => (
      <Box marginTop={1} marginRight={1} key={`${policeCaseNumber}-${index}`}>
        <Tag disabled>{policeCaseNumber}</Tag>
      </Box>
    ))}
  </Box>
)

export default PoliceCaseNumbersTags
