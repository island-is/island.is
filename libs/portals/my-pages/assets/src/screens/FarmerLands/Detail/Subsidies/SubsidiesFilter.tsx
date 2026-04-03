import {
  Accordion,
  AccordionItem,
  Box,
  DatePicker,
  Divider,
  Filter,
  FilterMultiChoice,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { farmerLandsMessages as fm } from '../../../../lib/messages'
import * as styles from './Subsidies.css'

type FilterCategoryId = 'contract' | 'category'

const isFilterCategoryId = (id: string): id is FilterCategoryId =>
  id === 'contract' || id === 'category'

interface FilterItem {
  value: string
  label: string
}

interface Props {
  contractId?: string
  paymentCategoryId?: number
  dateFrom?: Date
  dateTo?: Date
  filterCount: number
  contractItems: FilterItem[]
  categoryItems: FilterItem[]
  onContractChange: (value?: string) => void
  onCategoryChange: (value?: number) => void
  onDateChange: (start?: Date, end?: Date) => void
  onClear: () => void
}

export const SubsidiesFilter = ({
  contractId,
  paymentCategoryId,
  dateFrom,
  dateTo,
  filterCount,
  contractItems,
  categoryItems,
  onContractChange,
  onCategoryChange,
  onDateChange,
  onClear,
}: Props) => {
  const { formatMessage, lang } = useLocale()

  return (
    <Filter
      variant="popover"
      align="left"
      reverse
      labelOpen={formatMessage(m.openFilter)}
      labelClose={formatMessage(m.closeFilter)}
      labelClear={formatMessage(m.clearFilter)}
      labelClearAll={formatMessage(m.clearAllFilters)}
      filterCount={filterCount}
      onFilterClear={onClear}
    >
      <FilterMultiChoice
        labelClear={formatMessage(m.clearSelected)}
        singleExpand
        onChange={({ categoryId, selected }) => {
          if (!isFilterCategoryId(categoryId)) return
          switch (categoryId) {
            case 'contract':
              return onContractChange(selected[0])
            case 'category':
              return onCategoryChange(
                selected[0] ? Number(selected[0]) : undefined,
              )
          }
        }}
        onClear={(categoryId) => {
          if (!isFilterCategoryId(categoryId)) return
          switch (categoryId) {
            case 'contract':
              return onContractChange(undefined)
            case 'category':
              return onCategoryChange(undefined)
          }
        }}
        categories={[
          {
            id: 'contract',
            label: formatMessage(fm.subsidyContract),
            selected: contractId ? [contractId] : [],
            filters: contractItems,
            singleOption: true,
            searchPlaceholder: formatMessage(m.searchPlaceholder),
          },
          {
            id: 'category',
            label: formatMessage(fm.subsidyCategory),
            selected:
              paymentCategoryId != null ? [String(paymentCategoryId)] : [],
            filters: categoryItems,
            singleOption: true,
            searchPlaceholder: formatMessage(m.searchPlaceholder),
          },
        ]}
      />
      <Box className={styles.dateFilter} paddingX={3}>
        <Box borderBottomWidth="standard" borderColor="blue200" width="full" />
        <Box marginTop={1}>
          <Accordion dividerOnTop={false} dividerOnBottom={false} singleExpand>
            <AccordionItem
              id="subsidy-filter-date"
              label={formatMessage(m.datesLabel)}
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
              startExpanded={dateFrom != null || dateTo != null}
            >
              <Box
                className={styles.accordionBox}
                display="flex"
                flexDirection="column"
              >
                <DatePicker
                  name="subsidy-date-range"
                  backgroundColor="blue"
                  placeholderText={formatMessage(m.datepickPeriodLabel)}
                  size="xs"
                  locale={lang}
                  range
                  appearInline
                  selectedRange={{ startDate: dateFrom, endDate: dateTo }}
                  handleChange={(start, end) => {
                    onDateChange(start, end)
                  }}
                />
              </Box>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </Filter>
  )
}

export default SubsidiesFilter
