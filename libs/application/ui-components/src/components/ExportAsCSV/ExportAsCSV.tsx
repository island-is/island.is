import React from 'react'
import { CSVLink } from 'react-csv'

import { Box, Button } from '@island.is/island-ui/core'

interface ExportCSVProps {
  data: string | object[]
  filename: string
  title?: string
  noDataMessage?: string
  variant?: 'text' | 'primary' | 'ghost' | 'utility' | undefined
}

export const ExportAsCSV = ({
  data,
  filename,
  variant = 'text',
  title = 'Sækja niðurstöður',
  noDataMessage = 'Engin gögn fundust',
}: ExportCSVProps) => {
  return (
    <Box display="flex">
      <CSVLink
        data={data?.length > 0 ? data : noDataMessage}
        filename={filename}
      >
        <Button variant={variant} icon="download" iconType="outline">
          {title}
        </Button>
      </CSVLink>
    </Box>
  )
}
