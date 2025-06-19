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
  nationalId?: string | null
}

interface ColumnTextProps {
  text: string | number
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

export const ApplicationsTableRow = ({
  id,
  submittedAt,
  status,
  nationalId,
}: Props) => {
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
        <ColumnText text={nationalId ?? 'N/A'} />{' '}
      </Column>
      <Column span="4/12">
        <ColumnText text={status ?? 'UNKNOWN'} />
      </Column>
    </Row>
  )
}
