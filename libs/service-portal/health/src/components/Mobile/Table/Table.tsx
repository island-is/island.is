import { Box, Button, Text } from '@island.is/island-ui/core'
import React, { useState } from 'react'

interface Props {
  data: {
    title: string
    data: React.ReactElement
  }[]
  children?: React.ReactElement
}

const Table: React.FC<Props> = ({ data, children }) => {
  const [extended, setExtended] = useState(false)
  return (
    <Box>
      {/* Title and expand button */}
      <Box>
        <Text>Titill á lyfi</Text>
        {children && (
          <Box>
            <Button
              circle
              icon={extended ? 'remove' : 'add'}
              onClick={() => setExtended(!extended)}
            />
          </Box>
        )}
      </Box>
      {/* Map through data */}
      <Box>
        {data.map((item, index) => {
          return (
            <Box key={index}>
              <Text>{item.title}</Text>
              <Box>{item.data}</Box>
            </Box>
          )
        })}
      </Box>
      {/* Children - visible when extended */}
      {extended && children}
    </Box>
  )
}

export default Table
