import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { Participant } from '../../shared/types'
import { formatPhoneNumber } from '../../utils'
import { participants } from '../../lib/messages'

interface Props {
  data: Participant[]
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
  const MAX_ROWS = 5

  const handleExpandTable = () => setIsExpanded(!isExpanded)
  return (
    <Box marginTop={1}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(participants.labels.name)}</T.HeadData>
            <T.HeadData>
              {formatMessage(participants.labels.nationalId)}
            </T.HeadData>
            <T.HeadData>{formatMessage(participants.labels.email)}</T.HeadData>
            <T.HeadData>
              {formatMessage(participants.labels.phoneNumber)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {!isExpanded && data.length > MAX_ROWS
            ? data
                .slice(0, MAX_ROWS)
                .map((line, index) => (
                  <TableRow
                    key={index}
                    line={[
                      line.nationalIdWithName.name,
                      line.nationalIdWithName.nationalId,
                      line.email,
                      formatPhoneNumber(line.phoneNumber),
                    ]}
                  />
                ))
            : data.map((line, index) => (
                <TableRow
                  key={index}
                  line={[
                    line.nationalIdWithName.name,
                    line.nationalIdWithName.nationalId,
                    line.email,
                    formatPhoneNumber(line.phoneNumber),
                  ]}
                />
              ))}
        </T.Body>
      </T.Table>
      {data.length > MAX_ROWS && (
        <Box display="flex" justifyContent="center" marginY={2}>
          <Button variant="text" onClick={handleExpandTable} size="small">
            {formatMessage(
              isExpanded
                ? participants.labels.seeLess
                : participants.labels.seeMore,
            )}
          </Button>
        </Box>
      )}
    </Box>
  )
}
