import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { CertificateOfTenureAnswers } from '../../shared/types'
import { certificateOfTenure } from '../../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'

interface Props {
  data: CertificateOfTenureAnswers[]
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

export const MachineTenureOverviewExpandableTable = ({ data }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatMessage } = useLocale()
  const MAX_ROWS = 5

  const handleExpandTable = () => setIsExpanded(!isExpanded)
  return (
    <Box marginTop={1}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              {formatMessage(certificateOfTenure.labels.machineNumber)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(certificateOfTenure.labels.machineType)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(certificateOfTenure.labels.tenureInHours)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(certificateOfTenure.labels.period)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {/* {!isExpanded && data.length > MAX_ROWS
            ? data
                .slice(0, MAX_ROWS)
                .map((line, index) => (
                  <TableRow
                    key={index}
                    line={[
                      line.name,
                      line.nationalId,
                      line.email,
                      formatPhoneNumber(line.phoneNumber),
                    ]}
                  />
                ))
            : data.map((line, index) => (
                <TableRow
                  key={index}
                  line={[
                    line.name,
                    line.nationalId,
                    line.email,
                    formatPhoneNumber(line.phoneNumber),
                  ]}
                />
              ))} */}
        </T.Body>
      </T.Table>
      {data.length > MAX_ROWS && (
        <Box display="flex" justifyContent="center" marginY={2}>
          {/* <Button variant="text" onClick={handleExpandTable} size="small">
            {formatMessage(
              isExpanded
                ? participants.labels.seeLess
                : participants.labels.seeMore,
            )}
          </Button> */}
        </Box>
      )}
    </Box>
  )
}
