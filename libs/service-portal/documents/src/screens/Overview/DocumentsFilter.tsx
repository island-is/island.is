import React from 'react'
import {
  Box,
  DatePicker,
  Checkbox,
  Filter,
  FilterMultiChoice,
  AccordionItem,
  Accordion,
  Input,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../utils/messages'
import * as styles from './Overview.css'

type FilterValues = {
  dateFrom: Date | null
  dateTo: Date | null
  searchQuery: string
  showUnread: boolean
  activeCategories: string[]
  activeSenders: string[]
}
interface Props {
  filterValue: FilterValues
  debounceChange: (e: any) => void
  handleClearFilters: () => void
  handleShowUnread: (value: boolean) => void
  handleCategoriesChange: (values: string[]) => void
  handleSendersChange: (values: string[]) => void
  handleDateFromChange: (date: Date) => void
  handleDateToChange: (date: Date) => void
  clearCategories: () => void
  clearSenders: () => void
  categories: { label: string; value: string }[]
  senders: { label: string; value: string }[]
}
const DocumentsFilter = ({
  filterValue,
  debounceChange,
  handleClearFilters,
  handleShowUnread,
  handleCategoriesChange,
  handleSendersChange,
  handleDateFromChange,
  handleDateToChange,
  clearCategories,
  clearSenders,
  categories,
  senders,
}: Props) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()

  return (
    <Filter
      resultCount={0}
      variant="popover"
      align="left"
      reverse
      labelClear={formatMessage(m.clearFilter)}
      labelClearAll={formatMessage(m.clearAllFilters)}
      labelOpen={formatMessage(m.openFilter)}
      labelClose={formatMessage(m.closeFilter)}
      filterInput={
        <Input
          placeholder={formatMessage(m.searchPlaceholder)}
          name="rafraen-skjol-input"
          size="xs"
          label={formatMessage(m.searchLabel)}
          onChange={debounceChange}
        />
      }
      onFilterClear={handleClearFilters}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        paddingX={3}
        className={styles.unreadFilter}
      >
        <Box paddingY={3}>
          <Checkbox
            id="show-unread"
            label={formatMessage(messages.onlyShowUnread)}
            checked={filterValue.showUnread}
            onChange={(e) => handleShowUnread(e.target.checked)}
          />
        </Box>
        <Box borderBottomWidth="standard" borderColor="blue200" width="full" />
      </Box>
      <FilterMultiChoice
        labelClear={formatMessage(m.clearSelected)}
        singleExpand={false}
        onChange={({ categoryId, selected }) => {
          if (categoryId === 'senders') {
            handleSendersChange(selected)
          }
          if (categoryId === 'categories') {
            handleCategoriesChange(selected)
          }
        }}
        onClear={(categoryId) => {
          if (categoryId === 'senders') {
            clearSenders()
          }
          if (categoryId === 'categories') {
            clearCategories()
          }
        }}
        categories={[
          {
            id: 'senders',
            label: formatMessage(messages.institutionLabel),
            selected: [...filterValue.activeSenders],
            filters: senders,
            inline: false,
            singleOption: false,
          },
          {
            id: 'categories',
            label: formatMessage(messages.groupLabel),
            selected: [...filterValue.activeCategories],
            filters: categories,
            inline: false,
            singleOption: false,
          },
        ]}
      ></FilterMultiChoice>
      <Box className={styles.dateFilter} paddingX={3}>
        <Box borderBottomWidth="standard" borderColor="blue200" width="full" />
        <Box marginTop={1}>
          <Accordion
            dividerOnBottom={false}
            dividerOnTop={false}
            singleExpand={false}
          >
            <AccordionItem
              key="date-accordion-item"
              id="date-accordion-item"
              label={formatMessage(m.datesLabel)}
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
            >
              <Box display="flex" flexDirection="column">
                <DatePicker
                  label={formatMessage(m.datepickerFromLabel)}
                  placeholderText={formatMessage(m.datepickLabel)}
                  locale="is"
                  backgroundColor="blue"
                  size="xs"
                  selected={filterValue.dateFrom}
                  handleChange={handleDateFromChange}
                />
                <Box marginTop={3}>
                  <DatePicker
                    label={formatMessage(m.datepickerToLabel)}
                    placeholderText={formatMessage(m.datepickLabel)}
                    locale="is"
                    backgroundColor="blue"
                    size="xs"
                    selected={filterValue.dateTo}
                    handleChange={handleDateToChange}
                    minDate={filterValue.dateFrom || undefined}
                  />
                </Box>
              </Box>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </Filter>
  )
}

export default DocumentsFilter
