import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'

import {
  Accordion,
  AccordionItem,
  Box,
  Checkbox,
  Icon,
  Inline,
  Input,
  LoadingDots,
  Tag,
} from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'

import { m } from '../messages'
import * as styles from './FilterSearchAccordion.css'

const SEARCH_DEBOUNCE_MS = 300

export interface AsyncFilterItem {
  value: string
  label: string
}

export interface AsyncFilterPage {
  items: AsyncFilterItem[]
  hasNextPage: boolean
  endCursor?: string | null
}

interface Props {
  id: string
  title: string
  selected: string[]
  onChange: (selected: string[]) => void
  initiallyExpanded?: boolean
  /**
   * Fetches a single page of items from the server.
   *
   * Called with `after: undefined` whenever the (debounced) search term
   * changes, to start a fresh first page, and with the previous page's
   * `endCursor` when the user scrolls to the bottom of the list.
   */
  fetchPage: (args: {
    search: string
    after?: string | null
  }) => Promise<AsyncFilterPage>
  /**
   * Labels for currently selected values that may not be present in the
   * currently loaded page (e.g. selected via URL query state before the
   * list has finished loading). Falls back to the raw value if missing.
   */
  selectedLabels?: Record<string, string>
}

export const AsyncFilterSearchAccordion = ({
  id,
  title,
  selected,
  onChange,
  initiallyExpanded = false,
  fetchPage,
  selectedLabels,
}: Props) => {
  const { formatMessage } = useIntl()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<AsyncFilterItem[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [endCursor, setEndCursor] = useState<string | null | undefined>()
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const scrollListRef = useRef<HTMLElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Guards against the race between a debounced search reset and an
  // in-flight scroll-triggered "load more" request: every fetch captures
  // the current generation, and its response is discarded if the
  // generation has since moved on (i.e. a new search reset the list).
  const generationRef = useRef(0)

  const loadFirstPage = (search: string) => {
    const generation = ++generationRef.current
    setLoading(true)
    setLoadingMore(false)
    fetchPage({ search })
      .then((page) => {
        if (generation !== generationRef.current) {
          return
        }
        setItems(page.items)
        setHasNextPage(page.hasNextPage)
        setEndCursor(page.endCursor)
      })
      .catch(() => {
        if (generation !== generationRef.current) {
          return
        }
        setItems([])
        setHasNextPage(false)
        setEndCursor(undefined)
      })
      .finally(() => {
        if (generation !== generationRef.current) {
          return
        }
        setLoading(false)
      })
  }

  // Initial load.
  useEffect(() => {
    loadFirstPage('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced search-as-you-type — resets to a fresh first page. Skips its
  // first invocation since the initial-load effect above already covers it.
  const isFirstDebounce = useRef(true)
  useDebounce(
    () => {
      if (isFirstDebounce.current) {
        isFirstDebounce.current = false
        return
      }
      loadFirstPage(query)
    },
    SEARCH_DEBOUNCE_MS,
    [query],
  )

  const loadMore = () => {
    if (loading || loadingMore || !hasNextPage) {
      return
    }

    const generation = generationRef.current
    setLoadingMore(true)
    fetchPage({ search: query, after: endCursor })
      .then((page) => {
        if (generation !== generationRef.current) {
          // A new search started while this request was in flight —
          // discard the stale page.
          return
        }
        setItems((prev) => [...prev, ...page.items])
        setHasNextPage(page.hasNextPage)
        setEndCursor(page.endCursor)
      })
      .catch(() => {
        if (generation !== generationRef.current) {
          return
        }
      })
      .finally(() => {
        if (generation !== generationRef.current) {
          return
        }
        setLoadingMore(false)
      })
  }

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      {
        root: scrollListRef.current,
        rootMargin: '0px',
        threshold: 0,
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, endCursor, query, loading, loadingMore])

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const selectedItems = useMemo(
    () =>
      selected.map((value) => {
        const found = items.find((item) => item.value === value)
        return {
          value,
          label: found?.label ?? selectedLabels?.[value] ?? value,
        }
      }),
    [selected, items, selectedLabels],
  )

  // Selected items float to the top of the list, followed by the rest of
  // the loaded page in its original order.
  const displayItems = useMemo(() => {
    const selectedSet = new Set(selected)
    const unselected = items.filter((item) => !selectedSet.has(item.value))
    return [...selectedItems, ...unselected]
  }, [selectedItems, items, selected])

  return (
    <Box paddingTop={1} paddingX={3}>
      <Accordion
        space={3}
        dividerOnBottom={false}
        dividerOnTop={false}
        singleExpand
      >
        <AccordionItem
          id={id}
          label={title}
          labelUse="h5"
          labelVariant="h5"
          labelColor={selected.length > 0 ? 'blue400' : 'currentColor'}
          iconVariant="small"
          startExpanded={initiallyExpanded}
        >
          <Box marginBottom={2}>
            <Input
              name={`${id}-search`}
              placeholder={formatMessage(m.search.filterSearch)}
              size="xs"
              backgroundColor="blue"
              value={query}
              icon={{ type: 'outline', name: 'search' }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>

          {selectedItems.length > 0 && (
            <Box marginTop={1} marginBottom={2} className={styles.tagList}>
              <Inline space={1}>
                {selectedItems.map((item) => (
                  <Tag
                    key={item.value}
                    variant="blue"
                    onClick={() => toggle(item.value)}
                  >
                    <Box
                      component="span"
                      display="flex"
                      alignItems="center"
                      columnGap={1}
                    >
                      <Box component="span" className={styles.tagLabel}>
                        {item.label}
                      </Box>
                      <Icon icon="close" size="small" color="blue400" />
                    </Box>
                  </Tag>
                ))}
              </Inline>
            </Box>
          )}

          <Box ref={scrollListRef} className={styles.scrollList} paddingX={1}>
            {loading && items.length === 0 ? (
              <Box className={styles.loadingMoreRow}>
                <LoadingDots />
              </Box>
            ) : (
              <>
                {displayItems.map((item) => (
                  <Checkbox
                    key={item.value}
                    name={`${id}-${item.value}`}
                    label={item.label}
                    checked={selected.includes(item.value)}
                    onChange={() => toggle(item.value)}
                  />
                ))}
                {hasNextPage && (
                  <div ref={sentinelRef} className={styles.sentinel} />
                )}
                {loadingMore && (
                  <Box className={styles.loadingMoreRow}>
                    <LoadingDots />
                  </Box>
                )}
              </>
            )}
          </Box>
          <Box aria-live="polite" className={helperStyles.srOnly}>
            {loadingMore ? formatMessage(m.search.loadingMore) : ''}
          </Box>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
