import { m } from '@island.is/form-system/ui'
import {
  Box,
  GridColumn as Column,
  Icon,
  GridRow as Row,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import * as styles from '../../../tableHeader.css'

export type SortColumn = 'name' | 'lastModified' | 'status'
export type SortDirection = 'asc' | 'desc'

interface Props {
  sortColumn: SortColumn | null
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

interface SortIndicatorProps {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}

const SortIndicator = ({
  column,
  sortColumn,
  sortDirection,
}: SortIndicatorProps) => (
  <Box marginLeft={1} style={{ opacity: column === sortColumn ? 0.7 : 0.2 }}>
    <Icon
      icon={
        column === sortColumn && sortDirection === 'desc'
          ? 'arrowDown'
          : 'arrowUp'
      }
      size="small"
      color="blue400"
    />
  </Box>
)

export const TableHeader = ({ sortColumn, sortDirection, onSort }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <Box className={styles.header}>
      <Row>
        <Column span="7/12">
          <Box
            paddingLeft={2}
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => onSort('name')}
          >
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.name)}
            </Text>
            <SortIndicator
              column="name"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </Box>
        </Column>
        <Column span="2/12">
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="center"
            cursor="pointer"
            onClick={() => onSort('lastModified')}
          >
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.lastModified)}
            </Text>
            <SortIndicator
              column="lastModified"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </Box>
        </Column>

        <Column span="2/12">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            onClick={() => onSort('status')}
          >
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.state)}
            </Text>
            <SortIndicator
              column="status"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </Box>
        </Column>

        <Column span="1/12">
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage(m.actions)}
          </Text>
        </Column>
      </Row>
    </Box>
  )
}
