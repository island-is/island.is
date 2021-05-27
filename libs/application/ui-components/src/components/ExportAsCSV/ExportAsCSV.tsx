import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { CSVLink } from 'react-csv'

interface ExportCSVProps {
  data: any
  filename: string
  title: string
}

const ExportAsCSV = ({
  data,
  filename,
  title = 'Sækja niðurstöður',
}: ExportCSVProps) => {
  return (
    <Box display="flex">
      <CSVLink
        data={data && data.length > 0 ? data : 'Engin gögn fundust'}
        filename={filename}
      >
        <Button variant="text" icon="download" iconType="outline">
          {title}
        </Button>
      </CSVLink>
    </Box>
  )
}

export default ExportAsCSV
