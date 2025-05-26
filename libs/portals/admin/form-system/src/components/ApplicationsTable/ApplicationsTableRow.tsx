import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

interface Props {
  id?: string | null
  submittedAt?: Date
  status?: string | null
}

interface ColumnTextProps {
  text: string | number
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

export const ApplicationsTableRow = ({ id, submittedAt, status }: Props) => {
  const { formatDate } = useIntl()
  return (
    <Row key={id}>
      <Column span="4/12">
        <ColumnText
          text={formatDate(submittedAt ? submittedAt : new Date(), {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })}
        />
      </Column>
      <Column span="4/12">
        <ColumnText
          text="1234567890" // Placeholder for national ID, replace with actual data if available
        />
      </Column>
      <Column span="4/12">
        <ColumnText text={status ?? 'UNKNOWN'} />
      </Column>
    </Row>
  )
}
