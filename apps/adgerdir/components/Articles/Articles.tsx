import React, { FC, useState, useCallback, useEffect, useRef } from 'react'
import _ from 'lodash'
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
import { AdgerdirPage, AdgerdirTag } from '@island.is/api/schema'
import Card from '../Card/Card'

import * as cardStyles from '../Card/Card.treat'
import * as styles from './Articles.treat'

const FILTER_TIMER = 300
const ITEMS_PER_SHOW = 6

interface ArticlesProps {
  items: AdgerdirPage[]
  tags: AdgerdirTag[]
  seeMoreText?: string
  currentArticle?: AdgerdirPage
  showAll?: boolean
}

export const Articles: FC<ArticlesProps> = ({
  seeMoreText = 'Sjá fleiri',
  items,
  tags,
  currentArticle,
  showAll,
}) => {
  // const cardsRef = useRef<Array<HTMLElement | null>>([])
  const [filterString, setFilterString] = useState<string>('')
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

  const statusNames = {
    preparing: 'Í undirbúningi',
    ongoing: 'Í framkvæmd',
    completed: 'Lokið',
  }

  const handleChange = (e) => {
    e.preventDefault()
    setFilterString(e.target.value)
  }

  const onFilterStringChange = useCallback(() => {
    const arr = []

    items.forEach(({ title, description }, index) => {
      const str = `${title} ${description}`

      if (str.match(new RegExp(filterString.trim(), 'gi'))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByString(arr)
  }, [items, filterString])

  const onFilterTagChange = useCallback(() => {
    const arr = []

    items.forEach(({ tags }, index) => {
      if (tags.some(({ id }) => tagIds.includes(id as string))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByTag(arr)
  }, [items, tagIds])

  const onFilterStatusChange = useCallback(() => {
    const arr = []

    items.forEach(({ status }, index) => {
      if (selectedStatuses.includes(status)) {
        arr.push(index)
      }
    })

    setIndexesFilteredByStatus(arr)
  }, [items, selectedStatuses])

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

  const filteredItems = items
    .filter((item, index) => {
      const indexList = [
        indexesFilteredByStatus,
        indexesFilteredByTag,
        indexesFilteredByString,
      ].filter((x) => x.length > 0)

      return _.intersection(...indexList).includes(index)
    })
    .splice(0, showAll ? items.length : showCount)

  const statusTypes = items.reduce((statuses, cur) => {
    if (cur.status) {
      if (!statuses.includes(cur.status)) {
        statuses.push(cur.status)
      }
    }

    return statuses
  }, [])

  useEffect(() => {
    if (currentArticle) {
      setTagIds(currentArticle.tags.map((x) => x.id))
    }
  }, [currentArticle])

  return (
    <Box padding={[3, 3, 6]}>
      <Stack space={6}>
        <Box className={styles.filters}>
          <Box display="flex" alignItems="center" marginRight={[0, 0, 0, 3]}>
            <Stack space={3}>
              <Inline space={2} alignY="center">
                <Typography variant="tag" color="red600">
                  Staða aðgerðar:
                </Typography>
                {statusTypes.map((status, index) => {
                  return (
                    <Tag
                      key={index}
                      variant="red"
                      onClick={() => onStatusClick(status)}
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
              <Inline space={2} alignY="center">
                <Typography variant="tag" color="red600">
                  Málefni:
                </Typography>
                {tags.map(({ title, id }, index) => {
                  return (
                    <Tag
                      key={index}
                      variant="red"
                      onClick={() => onTagClick(id)}
                      active={tagIds.includes(id)}
                      bordered
                    >
                      {title}
                    </Tag>
                  )
                })}
              </Inline>
            </Stack>
          </Box>
          <Box display="flex" marginTop={[3, 3, 3, 0]} alignItems="center">
            <div className={styles.inputWrapper}>
              <input
                onChange={handleChange}
                placeholder="Sía eftir leitarorði"
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
                {!filterString ? 'völdum málefnum/stöðum hér fyrir ofan' : null}
                .
              </Typography>
            </Stack>
          </Box>
        ) : null}
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
                  as={`/${slug}`}
                  href={`/[slug]`}
                />
              )
            },
          )}
        </Tiles>
        {showCount < items.length ? (
          <Box textAlign="center">
            <Button
              onClick={() => {
                setShowCount(showCount + ITEMS_PER_SHOW)
              }}
              variant="ghost"
            >
              {seeMoreText}
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Box>
  )
}

export default Articles
