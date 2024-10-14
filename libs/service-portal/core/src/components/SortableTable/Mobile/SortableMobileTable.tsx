import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import React, { useState } from 'react'

export interface TableRow {
  title: string
  data: {
    title: string
    content: string
  }[]
  action?: {
    type: 'button' | 'alert'
    label: string
    onClick: () => void
  }
  children?: React.ReactElement
}

interface Props {
  header: string
  rows: TableRow[]
}

const Table: React.FC<Props> = ({ header, rows }) => {
  const [extended, setExtended] = useState(false)
  return (
    <Box>
      {/* Table Header */}
      <Text>{header}</Text>
      {rows.map((tableRow, index) => (
        <Box
          borderRadius="standard"
          borderColor="blue200"
          border="standard"
          padding={2}
          marginBottom={2}
          key={index}
        >
          <Box marginBottom={1}>
            <Text variant="h4" as="h2" color="blue400">
              {tableRow.title}
            </Text>
            {tableRow.children && (
              <Box>
                {tableRow.action?.type === 'button' && (
                  <Button
                    circle
                    icon={extended ? 'remove' : 'add'}
                    onClick={() => setExtended(!extended)}
                  />
                )}
              </Box>
            )}
          </Box>
          {/* Map through data */}
          <Box>
            {tableRow.data.map((item, index) => {
              return (
                <Box key={index} display="flex" flexDirection="row">
                  <Box width="half">
                    <Text fontWeight="medium" variant="medium">
                      {item.title}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">{item.content}</Text>
                  </Box>
                </Box>
              )
            })}
          </Box>
          <Box>
            {tableRow.action?.type === 'alert' && (
              <AlertMessage type="info" message={tableRow.action.label} />
            )}
          </Box>
          {/* Children - visible when extended */}
          {extended && tableRow.children}
        </Box>
      ))}
    </Box>
  )
}

export default Table
