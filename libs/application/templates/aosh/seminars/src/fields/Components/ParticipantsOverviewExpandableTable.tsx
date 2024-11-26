import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'

type ParticipantsTableData = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
}

interface Props {
  data: ParticipantsTableData[]
}

const TableRow = ({ line }: { line: string[] }) => {
  return (
    <T.Row>
      {line.map((cell, index) => (
        <T.Data key={`${cell}-${index}`}>{cell}</T.Data>
      ))}
    </T.Row>
  )
}

export const ParticipantsOverviewExpandableTable = ({ data }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatMessage } = useLocale()

  const mockData = [
    ['Notandi Jóns', '012345-6789', 'notandijons@famemail.com', '666 8999'],
    ['Þátttakandi 1 Jóns', '012345-6789', 'thatttakandi1@email.co', '666 8999'],
    ['Þátttakandi 2 Jóns', '012345-6789', 'thatttakandi2@email.co', '666 8999'],
  ]

  const handleExpandTable = () => setIsExpanded(!isExpanded)
  return (
    <Box marginTop={1}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Nafn þátttakanda</T.HeadData>
            <T.HeadData>Kennitala</T.HeadData>
            <T.HeadData>Netfang</T.HeadData>
            <T.HeadData>Símanúmer</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {!isExpanded && mockData.length > 2
            ? mockData
                .slice(0, 2)
                .map((line, index) => <TableRow key={index} line={line} />)
            : mockData.map((line, index) => (
                <TableRow key={index} line={line} />
              ))}
        </T.Body>
      </T.Table>
      {mockData.length > 2 && (
        <Box display="flex" justifyContent="center" marginY={2}>
          <Button variant="text" onClick={handleExpandTable} size="small">
            {isExpanded ? 'Sjá færri' : 'Sjá fleiri'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
