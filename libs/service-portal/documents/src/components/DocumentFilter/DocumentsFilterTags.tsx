import { Box, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import React from 'react'
import FilterTag from '../FilterTag/FilterTag'
import { m } from '@island.is/service-portal/core'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { messages } from '../../utils/messages'
import { FilterValuesType } from '../../utils/types'

interface Props {
  filterValue: FilterValuesType
  handleShowUnread: (value: boolean) => void
  handleCategoriesChange: (values: string[]) => void
  handleSendersChange: (values: string[]) => void
  handleDateFromChange: (date: Date | null) => void
  handleDateToChange: (date: Date | null) => void
  handleClearFilters: () => void
  handleShowArchived: (value: boolean) => void
  handleShowBookmarked: (value: boolean) => void
  categories: { label: string; value: string }[]
  senders: { label: string; value: string }[]
}
const DocumentsFilterTags = ({
  filterValue,
  handleClearFilters,
  handleShowUnread,
  handleCategoriesChange,
  handleSendersChange,
  handleDateFromChange,
  handleDateToChange,
  handleShowArchived,
  handleShowBookmarked,
  categories,
  senders,
}: Props) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()

  const getCategoryTitle = (id: string) => {
    if (categories.length === 0) {
      return ''
    }
    const category = categories?.find((item) => item.value === id)
    return category?.label || ''
  }

  const getSenderTitle = (id: string) => {
    const sender = senders?.find((item) => item.value === id)
    return sender?.label || ''
  }
  return (
    <Box display="flex" flexWrap="wrap" rowGap={1} alignItems="center">
      {filterValue.activeCategories.length > 0 &&
        filterValue.activeCategories.map((activecat) => (
          <FilterTag
            onClick={() =>
              handleCategoriesChange(
                filterValue.activeCategories.filter(
                  (item) => item !== activecat,
                ),
              )
            }
            key={`cat-${activecat}`}
            title={getCategoryTitle(activecat)}
          />
        ))}
      {filterValue.activeSenders.length > 0 &&
        filterValue.activeSenders.map((activeSender) => (
          <FilterTag
            onClick={() =>
              handleSendersChange(
                filterValue.activeSenders.filter(
                  (item) => item !== activeSender,
                ),
              )
            }
            key={`sender-${activeSender}`}
            title={getSenderTitle(activeSender)}
          />
        ))}
      {filterValue.dateFrom && (
        <FilterTag
          onClick={() => handleDateFromChange(null)}
          title={`${formatMessage(m.datepickerFromLabel)} - ${format(
            filterValue.dateFrom,
            dateFormat.is,
          )}`}
        />
      )}
      {filterValue.dateTo && (
        <FilterTag
          onClick={() => handleDateToChange(null)}
          title={`${formatMessage(m.datepickerToLabel)} - ${format(
            filterValue.dateTo,
            dateFormat.is,
          )}`}
        />
      )}
      {filterValue.showUnread && (
        <FilterTag
          onClick={() => handleShowUnread(false)}
          title={formatMessage(messages.onlyShowUnreadShort)}
        />
      )}
      {filterValue.archived && (
        <FilterTag
          onClick={() => handleShowArchived(false)}
          title={formatMessage(messages.onlyShowArchived)}
        />
      )}
      {filterValue.bookmarked && (
        <FilterTag
          onClick={() => handleShowBookmarked(false)}
          title={formatMessage(messages.onlyShowBookmarked)}
        />
      )}
      <Box marginLeft={1}>
        <Button
          icon="reload"
          size="small"
          variant="text"
          onClick={handleClearFilters}
        >
          {formatMessage(m.clearFilter)}
        </Button>
      </Box>
    </Box>
  )
}

export default DocumentsFilterTags
