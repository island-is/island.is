import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HeaderArrow } from '../../components/HeaderArrow/HeaderArrow'
import { SortDirectionType, SortType } from '../../utils/types'
import { messages } from '../../utils/messages'
import * as styles from './TableHeading.css'

interface Props {
  setSortState: (sort: SortType) => void
  sortState: SortType
}
const TableHeading = ({ setSortState, sortState }: Props) => {
  const { formatMessage } = useLocale()

  const getSortDirection = (currentDirection: SortDirectionType) => {
    const reverseDirection =
      currentDirection === 'Ascending' ? 'Descending' : 'Ascending'
    return reverseDirection
  }

  return (
    <div>
      <Box className={styles.tableHeading} paddingY={2} background="blue100">
        <GridRow>
          <GridColumn span={['1/1', '2/12']}>
            <Box paddingX={2}>
              <HeaderArrow
                active={sortState?.key === 'Date'}
                direction={sortState?.direction}
                title={formatMessage(messages.tableHeaderDate)}
                onClick={() =>
                  setSortState({
                    direction: getSortDirection(sortState?.direction),
                    key: 'Date',
                  })
                }
              />
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '4/12']}>
            <Box paddingX={2}>
              <HeaderArrow
                active={sortState?.key === 'Subject'}
                direction={sortState?.direction}
                title={formatMessage(messages.tableHeaderInformation)}
                onClick={() =>
                  setSortState({
                    direction: getSortDirection(sortState?.direction),
                    key: 'Subject',
                  })
                }
              />
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '3/12']}>
            <Box paddingX={2}>
              <HeaderArrow
                active={sortState?.key === 'Category'}
                direction={sortState?.direction}
                title={formatMessage(messages.tableHeaderGroup)}
                onClick={() =>
                  setSortState({
                    direction: getSortDirection(sortState?.direction),
                    key: 'Category',
                  })
                }
              />
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '3/12']}>
            <Box paddingX={2}>
              <HeaderArrow
                active={sortState?.key === 'Sender'}
                direction={sortState?.direction}
                title={formatMessage(messages.tableHeaderInstitution)}
                onClick={() =>
                  setSortState({
                    direction: getSortDirection(sortState?.direction),
                    key: 'Sender',
                  })
                }
              />
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </div>
  )
}
export default TableHeading
