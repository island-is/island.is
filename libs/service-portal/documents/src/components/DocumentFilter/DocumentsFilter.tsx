import React from 'react'
import {
  Box,
  DatePicker,
  Checkbox,
  FilterMultiChoice,
  AccordionItem,
  Accordion,
  Input,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { m, Filter } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../utils/messages'
import * as styles from './DocumentsFilter.css'
import DocumentsFilterTags from './DocumentsFilterTags'
import isEqual from 'lodash/isEqual'
import { defaultFilterValues, FilterValuesType } from '../../utils/types'
import {
  DocumentCategory,
  DocumentSender,
  DocumentType,
} from '@island.is/api/schema'

interface Props {
  filterValue: FilterValuesType
  debounceChange: (e: any) => void
  handleClearFilters: () => void
  handleShowUnread: (value: boolean) => void
  handleShowArchived: (value: boolean) => void
  handleShowBookmarked: (value: boolean) => void
  handleCategoriesChange: (values: string[]) => void
  handleSendersChange: (values: string[]) => void
  handleDateFromChange: (date: Date | null) => void
  handleDateToChange: (date: Date | null) => void
  clearCategories: () => void
  clearSenders: () => void
  categories: DocumentCategory[]
  senders: DocumentSender[]
  documentsLength: number
}
const DocumentsFilter = ({
  filterValue,
  debounceChange,
  handleClearFilters,
  handleShowUnread,
  handleShowArchived,
  handleShowBookmarked,
  handleCategoriesChange,
  handleSendersChange,
  handleDateFromChange,
  handleDateToChange,
  clearCategories,
  clearSenders,
  categories,
  senders,
  documentsLength,
}: Props) => {
  useNamespaces('sp.documents')
  const { formatMessage, lang } = useLocale()

  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const documentsFoundText = () =>
    documentsLength === 1 || (lang === 'is' && documentsLength % 10 === 1)
      ? messages.foundSingular
      : messages.found

  const mapToFilterItem = (
    array: DocumentCategory[] | DocumentSender[] | DocumentType[],
  ) => {
    return array.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
  }

  const sendersAvailable = mapToFilterItem(senders)
  const categoriesAvailable = mapToFilterItem(categories)
  return (
    <>
      <Filter
        resultCount={0}
        variant="popover"
        align="left"
        reverse
        labelClear={formatMessage(m.clearFilter)}
        labelClearAll={formatMessage(m.clearAllFilters)}
        labelOpen={formatMessage(m.openFilter)}
        labelClose={formatMessage(m.closeFilter)}
        fullWidthInput
        filterInput={
          <Input
            placeholder={formatMessage(m.searchPlaceholder)}
            name="rafraen-skjol-input"
            size="xs"
            onChange={debounceChange}
            backgroundColor="blue"
            icon={{ name: 'search' }}
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
          <Box paddingTop={3}>
            <Checkbox
              id="show-unread"
              label={formatMessage(messages.onlyShowUnread)}
              checked={filterValue.showUnread}
              onChange={(e) => handleShowUnread(e.target.checked)}
            />
          </Box>
          <Box paddingTop={1}>
            <Checkbox
              id="show-bookmarked"
              label={formatMessage(messages.onlyShowBookmarked)}
              checked={filterValue.bookmarked}
              onChange={(e) => handleShowBookmarked(e.target.checked)}
            />
          </Box>
          <Box paddingTop={1} paddingBottom={3}>
            <Checkbox
              id="show-archived"
              label={formatMessage(messages.onlyShowArchived)}
              checked={filterValue.archived}
              onChange={(e) => handleShowArchived(e.target.checked)}
            />
          </Box>
          <Box
            borderBottomWidth="standard"
            borderColor="blue200"
            width="full"
          />
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
              filters: sendersAvailable,
              inline: false,
              singleOption: false,
            },
            {
              id: 'categories',
              label: formatMessage(messages.groupLabel),
              selected: [...filterValue.activeCategories],
              filters: categoriesAvailable,
              inline: false,
              singleOption: false,
            },
          ]}
        />
        <Box className={styles.dateFilter} paddingX={3}>
          <Box
            borderBottomWidth="standard"
            borderColor="blue200"
            width="full"
          />
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
                  <Box>
                    <DatePicker
                      label={formatMessage(m.datepickerFromLabel)}
                      placeholderText={formatMessage(m.datepickLabel)}
                      locale="is"
                      backgroundColor="blue"
                      size="xs"
                      selected={filterValue.dateFrom}
                      handleChange={handleDateFromChange}
                      appearInline
                    />
                  </Box>
                  <Box marginTop={3}>
                    <DatePicker
                      label={formatMessage(m.datepickerToLabel)}
                      placeholderText={formatMessage(m.datepickLabel)}
                      locale="is"
                      backgroundColor="blue"
                      size="xs"
                      selected={filterValue.dateTo}
                      handleChange={handleDateToChange}
                      appearInline
                      minDate={filterValue.dateFrom || undefined}
                    />
                  </Box>
                </Box>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
      </Filter>
      <Hidden print>
        {hasActiveFilters() && (
          <Box display="flex" flexDirection="column" marginTop={4}>
            <DocumentsFilterTags
              filterValue={filterValue}
              categories={categoriesAvailable}
              senders={sendersAvailable}
              handleCategoriesChange={handleCategoriesChange}
              handleSendersChange={handleSendersChange}
              handleDateFromChange={handleDateFromChange}
              handleDateToChange={handleDateToChange}
              handleShowUnread={handleShowUnread}
              handleClearFilters={handleClearFilters}
              handleShowArchived={handleShowArchived}
              handleShowBookmarked={handleShowBookmarked}
            />

            <Text
              variant="eyebrow"
              as="h3"
              dataTestId="doc-found-text"
              marginTop={2}
            >{`${documentsLength} ${formatMessage(
              documentsFoundText(),
            )}`}</Text>
          </Box>
        )}
      </Hidden>
    </>
  )
}

export default DocumentsFilter
