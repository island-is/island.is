import React, { useState, useCallback, useEffect, useRef } from 'react'
import intersection from 'lodash/intersection'
import AnimateHeight from 'react-animate-height'
import cn from 'classnames'
import {
  Box,
  Tiles,
  Button,
  Stack,
  Text,
  Tag,
  Inline,
  Icon,
  LoadingIcon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Organization, OrganizationTag } from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'
import { Card } from '@island.is/web/components'

import * as styles from './FilteredCards.css'

const FILTER_TIMER = 300
const ITEMS_PER_SHOW = 6

interface FilteredCardsProps {
  title?: string
  items: Organization[]
  tags: OrganizationTag[]
  showAll?: boolean
  namespace?: object
  startingIds?: Array<string>
}

export const FilteredCards = ({
  title,
  items,
  tags,
  showAll,
  namespace,
  startingIds = [],
}: FilteredCardsProps) => {
  const n = useNamespace(namespace)
  const [filterString, setFilterString] = useState<string>('')
  const [filtersToggled, setFiltersToggled] = useState<boolean>(true)
  const [filtersDisabled, setFiltersDisabled] = useState<boolean>(
    Boolean(startingIds.length),
  )
  const [startingItems, setstartingItems] = useState<Array<Organization>>(
    items.filter((x) => startingIds.includes(x.id)),
  )
  const [tagIds, setTagIds] = useState<Array<string>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCount, setShowCount] = useState<number>(ITEMS_PER_SHOW)
  const [indexesFilteredByString, setIndexesFilteredByString] = useState<
    Array<number>
  >([])
  const [indexesFilteredByTag, setIndexesFilteredByTag] = useState<
    Array<number>
  >([])
  const timerRef = useRef(null)

  const visibleItems = startingItems.length ? startingItems : items

  const handleResize = useCallback(() => {
    setFiltersToggled(window.innerWidth >= theme.breakpoints.lg)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const handleChange = (e) => {
    e.preventDefault()
    setFilterString(e.target.value)
  }

  const onFilterStringChange = useCallback(() => {
    const arr = []

    visibleItems.forEach(({ title, description }, index) => {
      const str = `${title} ${description}`

      if (str.match(new RegExp(filterString.trim(), 'gi'))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByString(arr)
  }, [visibleItems, filterString])

  const onFilterTagChange = useCallback(() => {
    const arr = []

    visibleItems.forEach(({ tag }, index) => {
      if (tag && tag.some(({ id }) => tagIds.includes(id as string))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByTag(arr)
  }, [visibleItems, tagIds])

  const doUpdate = useCallback(() => {
    onFilterStringChange()
    onFilterTagChange()
    setIsLoading(false)
  }, [onFilterStringChange, onFilterTagChange])

  const onUpdateFilters = useCallback(() => {
    clearTimeout(timerRef.current)
    setIsLoading(true)

    if (!filterString) {
      doUpdate()
    } else {
      timerRef.current = setTimeout(doUpdate, FILTER_TIMER)
    }
  }, [filterString, doUpdate])

  const onTagClick = (id: string) => {
    clearTimeout(timerRef.current)

    const arr = [...tagIds]
    const index = tagIds.findIndex((x) => x === id)

    if (index < 0) {
      arr.push(id)
    } else {
      arr.splice(index, 1)
    }

    setTagIds(arr)
  }

  useEffect(() => {
    onUpdateFilters()
    return () => clearTimeout(timerRef.current)
  }, [onUpdateFilters])

  const toggleFilters = () => {
    if (filtersDisabled) {
      setFiltersDisabled(false)
      setFiltersToggled(true)
    } else {
      setFiltersToggled(!filtersToggled)
    }
  }

  const filteredItems = [...visibleItems].filter((item, index) => {
    const indexList = [indexesFilteredByTag, indexesFilteredByString].filter(
      (x) => x.length > 0,
    )

    return intersection(...indexList).includes(index)
  })

  const batches = [...filteredItems].splice(
    0,
    showAll ? visibleItems.length : showCount,
  )

  const showMoreButton = batches.length < filteredItems.length

  return (
    <Box padding={[3, 3, 6]}>
      <Tiles space={0} columns={2}>
        <div>
          <Text variant="h3" as="h3" color="blue400">
            {title || n('organizations', 'Stofnanir')}
          </Text>
        </div>
        <Box display="flex" justifyContent="flexEnd">
          <button onClick={toggleFilters} className={styles.filtersToggler}>
            <Inline space={1}>
              <span>{n('filter', 'Sía')}</span>
              <div
                className={cn(styles.filtersIcon, {
                  [styles.filtersIconToggled]:
                    !filtersDisabled && filtersToggled,
                })}
              >
                <Icon icon="caretDown" size="small" />
              </div>
            </Inline>
          </button>
        </Box>
      </Tiles>
      <AnimateHeight
        duration={1000}
        height={!filtersDisabled && filtersToggled ? 'auto' : 0}
      >
        <Box marginTop={3} className={styles.filters}>
          <Box display="flex" alignItems="center" marginRight={[0, 0, 0, 3]}>
            <Stack space={2}>
              <Inline space={2} alignY="center" collapseBelow="sm">
                <Text variant="eyebrow" color="blue400">
                  {n('tag', 'Sía')}:
                </Text>
                <Inline space={2} alignY="center">
                  {tags.map(({ title, id }, index) => {
                    return (
                      <Tag
                        key={index}
                        variant="blue"
                        onClick={() => {
                          setstartingItems([])
                          onTagClick(id)
                        }}
                        active={tagIds.includes(id)}
                        outlined
                      >
                        {title}
                      </Tag>
                    )
                  })}
                </Inline>
              </Inline>
            </Stack>
          </Box>
          <Box display="flex" marginTop={[3, 3, 3, 0]} alignItems="center">
            <div className={styles.inputWrapper}>
              <input
                onChange={handleChange}
                placeholder={n('filterBySearchQuery', 'Sía eftir leitarorði')}
                className={styles.input}
              />
              <span className={styles.inputIcon}>
                {isLoading ? (
                  <LoadingIcon size={24} color="currentColor" />
                ) : (
                  <Icon size="medium" type="outline" icon="search" />
                )}
              </span>
            </div>
          </Box>
        </Box>
      </AnimateHeight>
      {batches.length === 0 ? (
        <Box>
          <Stack space={2}>
            <Text variant="intro">
              <span>Ekkert fannst með{` `}</span>
              {filterString
                ? `leitarorðinu „${filterString}“${
                    indexesFilteredByTag.length
                      ? ' og völdum tögum hér fyrir ofan'
                      : ''
                  }`
                : null}
              {!filterString ? 'völdum tögum hér fyrir ofan' : null}.
            </Text>
          </Stack>
        </Box>
      ) : null}
      <Box marginTop={3}>
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {batches.map(
            ({ title, description, tag, link }: Organization, index) => {
              const tags =
                (tag &&
                  tag.map((x) => ({
                    title: x.title,
                    tagProps: {
                      outlined: true,
                    },
                  }))) ||
                []

              return (
                <Card
                  link={{ href: link }}
                  key={index}
                  description={description}
                  title={title}
                  tags={tags}
                />
              )
            },
          )}
        </Tiles>
      </Box>
      {!showAll && showMoreButton ? (
        <Box
          display="flex"
          justifyContent="center"
          marginY={3}
          textAlign="center"
        >
          <Button
            onClick={() => {
              setShowCount(showCount + ITEMS_PER_SHOW)
            }}
          >
            {n('seeMoreItems')}
            {`(${filteredItems.length - showCount})`}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}

export default FilteredCards
