import React from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import BlueBox from '../BlueBox/BlueBox'
import { kb } from '../../utils/stepHelper'

interface Props {
  name: string
  size: number
  uploadedAt: string
  link: string
}

const CaseFile: React.FC<Props> = (props) => {
  const { name, size, uploadedAt } = props
  return (
    <BlueBox>
      <Box display="flex" justifyContent="spaceBetween">
        <Box display="flex" alignItems="center">
          <Box marginRight={1}>
            <Text fontWeight="semiBold">{name}</Text>
          </Box>
          <Text>{`(${kb(size)}KB)`}</Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box marginRight={2}>
            <Text variant="small">{uploadedAt}</Text>
          </Box>
          <Button size="small" variant="ghost">
            Opna
          </Button>
        </Box>
      </Box>
    </BlueBox>
  )
}

export default CaseFile
