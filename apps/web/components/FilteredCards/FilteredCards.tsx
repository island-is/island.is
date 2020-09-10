import React, { FC, useState, useCallback, useEffect, useRef } from 'react'
import _ from 'lodash'
import AnimateHeight from 'react-animate-height'
import cn from 'classnames'
import {
  Box,
  Tiles,
  Button,
  Stack,
  Typography,
  Tag,
  Inline,
  Icon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { AdgerdirPage, AdgerdirTag } from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { Card } from './Card'

import * as cardStyles from './Card.treat'
import * as styles from './FilteredCards.treat'

const FILTER_TIMER = 300
const ITEMS_PER_SHOW = 6

interface FilteredCardsProps {
  title?: string
  items: AdgerdirPage[]
  tags: AdgerdirTag[]
  currentArticle?: AdgerdirPage
  showAll?: boolean
  namespace?: object
  startingIds?: Array<string>
}

export const FilteredCards: FC<FilteredCardsProps> = ({
  title,
  items,
  tags,
  currentArticle,
  showAll,
  namespace,
  startingIds = [],
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const [filterString, setFilterString] = useState<string>('')
  const [filtersToggled, setFiltersToggled] = useState<boolean>(true)
  const [filtersDisabled, setFiltersDisabled] = useState<boolean>(
    Boolean(startingIds.length),
  )
  const [startingItems, setstartingItems] = useState<Array<AdgerdirPage>>(
    items.filter((x) => startingIds.includes(x.id)),
  )
  const [tagIds, setTagIds] = useState<Array<string>>([])
  const [selectedStatuses, setSelectedStatuses] = useState<Array<string>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCount, setShowCount] = useState<number>(ITEMS_PER_SHOW)
  const [indexesFilteredByString, setIndexesFilteredByString] = useState<
    Array<number>
  >([])
  const [indexesFilteredByTag, setIndexesFilteredByTag] = useState<
    Array<number>
  >([])
  const [indexesFilteredByStatus, setIndexesFilteredByStatus] = useState<
    Array<number>
  >([])
  const timerRef = useRef(null)

  const visibleItems = startingItems.length ? startingItems : items

  const statusNames = {
    preparing: 'Í undirbúningi',
    ongoing: 'Í framkvæmd',
    completed: 'Lokið',
  }

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

    visibleItems.forEach(({ tags }, index) => {
      if (tags.some(({ id }) => tagIds.includes(id as string))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByTag(arr)
  }, [visibleItems, tagIds])

  const onFilterStatusChange = useCallback(() => {
    const arr = []

    visibleItems.forEach(({ status }, index) => {
      if (selectedStatuses.includes(status)) {
        arr.push(index)
      }
    })

    setIndexesFilteredByStatus(arr)
  }, [visibleItems, selectedStatuses])

  const doUpdate = useCallback(() => {
    onFilterStringChange()
    onFilterTagChange()
    onFilterStatusChange()
    setIsLoading(false)
  }, [onFilterStringChange, onFilterTagChange, onFilterStatusChange])

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

  const onStatusClick = (status: string) => {
    clearTimeout(timerRef.current)
    const arr = [...selectedStatuses]
    const index = selectedStatuses.findIndex((x) => x === status)

    if (index < 0) {
      arr.push(status)
    } else {
      arr.splice(index, 1)
    }

    setSelectedStatuses(arr)
  }

  useEffect(() => {
    onUpdateFilters()
    return () => clearTimeout(timerRef.current)
  }, [onUpdateFilters])

  const filteredItems = visibleItems
    .filter((item, index) => {
      const indexList = [
        indexesFilteredByStatus,
        indexesFilteredByTag,
        indexesFilteredByString,
      ].filter((x) => x.length > 0)

      return _.intersection(...indexList).includes(index)
    })
    .splice(0, showAll ? visibleItems.length : showCount)

  useEffect(() => {
    if (currentArticle) {
      setTagIds(currentArticle.tags.map((x) => x.id))
    }
  }, [currentArticle])

  const toggleFilters = () => {
    if (filtersDisabled) {
      setFiltersDisabled(false)
      setFiltersToggled(true)
    } else {
      setFiltersToggled(!filtersToggled)
    }
  }

  return (
    <Box padding={[3, 3, 6]}>
      <Tiles space={0} columns={2}>
        <div>
          <Typography variant="h3" as="h3" color="red600">
            {title || n('adgerdir')}
          </Typography>
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
                <Icon type="caret" color="red600" width={12} height={12} />
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
                <Typography variant="tag" color="red600">
                  Staða aðgerðar:
                </Typography>
                <Inline space={2} alignY="center">
                  {Object.keys(statusNames).map((status, index) => {
                    return (
                      <Tag
                        key={index}
                        variant="red"
                        onClick={() => {
                          setstartingItems([])
                          onStatusClick(status)
                        }}
                        active={selectedStatuses.includes(status)}
                        bordered
                      >
                        <Box position="relative">
                          <Inline space={1} alignY="center">
                            <span>{statusNames[status]}</span>
                            <span
                              className={cn(
                                cardStyles.status,
                                cardStyles.statusType[status],
                              )}
                            ></span>
                          </Inline>
                        </Box>
                      </Tag>
                    )
                  })}
                </Inline>
              </Inline>
              <Inline space={2} alignY="center" collapseBelow="sm">
                <Typography variant="tag" color="red600">
                  Málefni:
                </Typography>
                <Inline space={2} alignY="center">
                  {tags.map(({ title, id }, index) => {
                    return (
                      <Tag
                        key={index}
                        variant="red"
                        onClick={() => {
                          setstartingItems([])
                          onTagClick(id)
                        }}
                        active={tagIds.includes(id)}
                        bordered
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
                <Icon
                  width="18"
                  height="18"
                  spin={isLoading}
                  type={isLoading ? 'loading' : 'search'}
                  color="red600"
                />
              </span>
            </div>
          </Box>
        </Box>
      </AnimateHeight>
      {filteredItems.length === 0 ? (
        <Box>
          <Stack space={2}>
            <Typography variant="intro" color="red600">
              <span>Ekkert fannst með{` `}</span>
              {filterString
                ? `leitarorðinu „${filterString}“${
                    indexesFilteredByTag.length ||
                    indexesFilteredByStatus.length
                      ? ' og völdum málefnum/stöðum hér fyrir ofan'
                      : ''
                  }`
                : null}
              {!filterString ? 'völdum málefnum/stöðum hér fyrir ofan' : null}.
            </Typography>
          </Stack>
        </Box>
      ) : null}
      <Box marginTop={3}>
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {filteredItems.map(
            (
              { title, description, tags, status, slug }: AdgerdirPage,
              index,
            ) => {
              return (
                <Card
                  key={index}
                  description={description}
                  title={title}
                  tags={tags}
                  status={status}
                  as={`/${
                    activeLocale !== 'is' ? `${activeLocale}/` : ''
                  }${slug}`}
                  href={`/${
                    activeLocale !== 'is' ? `${activeLocale}/` : ''
                  }[slug]`}
                />
              )
            },
          )}
        </Tiles>
      </Box>
      {showCount < visibleItems.length ? (
        <Box marginY={3} textAlign="center">
          <Button
            onClick={() => {
              setShowCount(showCount + ITEMS_PER_SHOW)
            }}
            width="fixed"
          >
            {n('seeMoreItems')}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}

export default FilteredCards
