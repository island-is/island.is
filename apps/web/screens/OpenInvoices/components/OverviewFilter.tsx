import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import {
  Box,
  Button,
  Checkbox,
  Divider,
  Filter,
  FilterProps,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'

import { useScrollShadows } from '../hooks/useScrollShadows'
import { m } from '../messages'
import {
  AsyncFilterItem,
  AsyncFilterPage,
  AsyncFilterSearchAccordion,
  AsyncSearchInputHandle,
} from './AsyncFilterSearchAccordion'
import { FilterDateAccordion } from './FilterDateAccordion'
import * as styles from './OverviewFilter.css'

export type SearchState = Record<string, Array<string> | undefined>

interface DateSelectProps {
  type: 'date'
  id: string
  label: string
  valueFrom: Date
  valueTo: Date
  isActive?: boolean
  /** Maximum allowed span, in days, between valueFrom and valueTo. */
  maxRangeDays?: number
  /** Latest date selectable in either picker, typically today. */
  maxSelectableDate?: Date
}

interface CheckboxProps {
  type: 'checkbox'
  id: string
  label: string
  checked?: boolean
}

interface AsyncSelectProps {
  type: 'asyncSelect'
  id: string
  label: string
  fetchPage: (args: {
    search: string
    after?: string | null
  }) => Promise<AsyncFilterPage>
  selectedItems?: Record<string, AsyncFilterItem>
  /**
   * Defaults to whether anything is selected. Needed where `selected` resolves
   * asynchronously, since `startExpanded` is only read on mount.
   */
  initiallyExpanded?: boolean
}

interface Props {
  onSearchUpdate: (
    categoryId: keyof SearchState,
    values?: Array<string>,
  ) => void
  onReset: () => void
  onApply: () => void
  applyDisabled?: boolean
  searchState?: SearchState
  url: string
  locale: Locale
  categories: Array<DateSelectProps | CheckboxProps | AsyncSelectProps>
  variant?: FilterProps['variant']
  hits?: number
  title?: string
}

export const OverviewFilter = ({
  onSearchUpdate,
  onReset,
  onApply,
  applyDisabled,
  searchState,
  categories,
  locale,
  url,
  variant = 'default',
  hits,
  title,
}: Props) => {
  const { formatMessage } = useIntl()

  const clear = () => {
    for (const category of categories) {
      searchInputRefs.current[category.id]?.clearSearchInput()
    }
    onReset()
  }

  const searchInputRefs = useRef<{
    [key: string]: AsyncSearchInputHandle | null
  }>({})

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const { atTop, atBottom } = useScrollShadows(scrollRef)

  const categoryList = categories.map((category, index) => {
    const divider =
      index > 0 ? (
        <Box paddingX={3}>
          <Divider />
        </Box>
      ) : null

    if (category.type === 'checkbox') {
      const searchStateValue = searchState?.[category.id]?.[0]
      return (
        <React.Fragment key={category.id}>
          {divider}
          <Box
            paddingX={3}
            paddingY={3}
            borderRadius="large"
            background="white"
          >
            <Checkbox
              name={`${variant}-${category.id}`}
              label={category.label}
              checked={searchStateValue === 'true'}
              onChange={(event) =>
                onSearchUpdate(
                  category.id as keyof SearchState,
                  event.target.checked ? ['true'] : ['false'],
                )
              }
            />
          </Box>
        </React.Fragment>
      )
    }
    if (category.type === 'date') {
      return (
        <React.Fragment key={category.id}>
          {divider}
          <FilterDateAccordion
            title={formatMessage(m.search.range)}
            id={`${variant}-${category.id}`}
            locale={locale}
            valueFrom={category.valueFrom}
            valueTo={category.valueTo}
            isActive={category.isActive}
            maxRangeDays={category.maxRangeDays}
            maxSelectableDate={category.maxSelectableDate}
            initiallyExpanded
            onChange={(valueFrom, valueTo) => {
              onSearchUpdate(category.id as keyof SearchState, [
                valueFrom?.toISOString() ?? '',
                valueTo?.toISOString() ?? '',
              ])
            }}
          />
        </React.Fragment>
      )
    }

    if (category.type === 'asyncSelect') {
      return (
        <React.Fragment key={category.id}>
          {divider}
          <AsyncFilterSearchAccordion
            id={`${variant}-${category.id}`}
            title={category.label}
            ref={(s) => {
              if (s) {
                searchInputRefs.current[category.id] = s
              } else {
                delete searchInputRefs.current[category.id]
              }
            }}
            selected={searchState?.[category.id] ?? []}
            initiallyExpanded={
              category.initiallyExpanded ??
              (searchState?.[category.id] ?? []).length > 0
            }
            fetchPage={category.fetchPage}
            selectedItems={category.selectedItems}
            onChange={(values) =>
              onSearchUpdate(
                category.id as keyof SearchState,
                values.length ? values : undefined,
              )
            }
          />
        </React.Fragment>
      )
    }

    return null
  })

  if (variant === 'default') {
    return (
      <Box className={styles.sidebar}>
        {title && (
          <Box className={styles.title}>
            <Box
              className={cn({ [styles.titleShadow]: !atTop })}
              paddingBottom={3}
            >
              <Text variant="h4" as="h3" paddingY={1}>
                {title}
              </Text>
            </Box>
          </Box>
        )}
        <Box
          component="form"
          className={styles.form}
          action={url}
          onSubmit={(e) => {
            e.preventDefault()
            onApply()
          }}
        >
          <Box ref={scrollRef} className={styles.scrollArea}>
            <Box className={styles.cardTop}>{categoryList}</Box>
          </Box>
          <Box className={styles.footer}>
            <Box
              className={cn(styles.footerCard, {
                [styles.footerCardShadow]: !atBottom,
              })}
            >
              {categories.length > 0 && (
                <Box paddingX={3}>
                  <Divider />
                </Box>
              )}
              <Box paddingX={3} paddingY={3}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="small"
                  fluid
                  disabled={applyDisabled}
                  loading={applyDisabled}
                >
                  {formatMessage(m.search.viewResults)}
                </Button>
              </Box>
            </Box>
            <Box textAlign="right" paddingTop={2}>
              <Button icon="reload" size="small" variant="text" onClick={clear}>
                {formatMessage(m.search.clearFilters)}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      component="form"
      borderRadius="large"
      action={url}
      onSubmit={(e) => {
        e.preventDefault()
        onApply()
      }}
    >
      {isMounted && (
        <Filter
          labelClearAll={formatMessage(m.search.clearFilters)}
          labelOpen={formatMessage(m.search.openFilter)}
          labelClose={formatMessage(m.search.closeFilter)}
          labelClear={formatMessage(m.search.clearFilters)}
          labelTitle={formatMessage(m.search.filterTitle)}
          labelResult={formatMessage(m.search.viewResults)}
          resultCount={hits}
          onFilterClear={clear}
          onFilterResult={onApply}
          variant={variant}
          align={'right'}
          usePopoverDiscloureButtonStyling
        >
          <Box background="white" borderRadius="large">
            {categoryList}
          </Box>
        </Filter>
      )}
    </Box>
  )
}
