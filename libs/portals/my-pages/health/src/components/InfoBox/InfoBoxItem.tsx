import { Box, Divider, Text } from '@island.is/island-ui/core'
import React from 'react'

interface InfoBoxItemProps {
  title: string
  data: { label: string; content?: React.ReactNode }[]
}

const InfoBoxItem: React.FC<InfoBoxItemProps> = ({ title, data }) => {
  return (
    <Box>
      <Text variant="h5" color="blue400">
        {title}
      </Text>
      {data.map((item, index) => {
        return (
          <Box
            key={index}
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
          >
            <Text variant="small">{item.label}</Text>
            <Box>{item.content}</Box>
          </Box>
        )
      })}
      <Box marginTop={3} />
      <Divider />
    </Box>
  )
}

export default InfoBoxItem
