import React, { FC, useState, useCallback, useEffect, useRef } from 'react'
import intersection from 'lodash/intersection'
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
  Divider,
} from '@island.is/island-ui/core'
import routeNames from '@island.is/web/i18n/routeNames'
import { AdgerdirPage, AdgerdirTag } from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { Card } from '@island.is/web/components'
import {
  ADGERDIR_INDIVIDUALS_TAG_ID,
  ADGERDIR_COMPANIES_TAG_ID,
} from '@island.is/web/constants'

import * as styles from './AdgerdirArticles.treat'

const FILTER_TIMER = 300
const ITEMS_PER_SHOW = 6

const DIVIDER_FILTERS = [ADGERDIR_INDIVIDUALS_TAG_ID, ADGERDIR_COMPANIES_TAG_ID]

interface AdgerdirArticlesProps {
  title?: string
  items: AdgerdirPage[]
  tags: AdgerdirTag[]
  currentArticle?: AdgerdirPage
  showAll?: boolean
  namespace?: object
  startingIds?: Array<string>
}

export const AdgerdirArticles: FC<AdgerdirArticlesProps> = ({
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
  const { makePath } = routeNames(activeLocale)
  const [filterString, setFilterString] = useState<string>('')
  const [startingItems, setstartingItems] = useState<Array<AdgerdirPage>>(
    items.filter((x) => startingIds.includes(x.id)),
  )
  const [tagIds, setTagIds] = useState<Array<string>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCount, setShowCount] = useState<number | null>(ITEMS_PER_SHOW)
  const [indexesFilteredByString, setIndexesFilteredByString] = useState<
    Array<number>
  >([])
  const [indexesFilteredByTag, setIndexesFilteredByTag] = useState<
    Array<number>
  >([])
  const timerRef = useRef(null)

  const visibleItems = startingItems.length ? startingItems : items

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

  const filteredItems = visibleItems.filter((_, index) => {
    const indexList = [indexesFilteredByTag, indexesFilteredByString].filter(
      (x) => x.length > 0,
    )

    return intersection(...indexList).includes(index)
  })

  const batches = [...filteredItems].splice(
    0,
    showAll ? filteredItems.length : showCount,
  )

  const showMoreButton = batches.length < filteredItems.length

  useEffect(() => {
    if (currentArticle) {
      setTagIds(currentArticle.tags.map((x) => x.id))
    }
  }, [currentArticle])

  const dividerRenames = {
    Einstaklingar: 'Einstaklinga',
  }

  return (
    <Box padding={[3, 3, 6]}>
      <Inline space={2} alignY="center">
        <Box>
          <Text variant="h3" as="h3" color="red600">
            {title || n('adgerdir2', 'Aðgerðir fyrir')}
          </Text>
        </Box>
        <Box>
          <Inline space={2} alignY="center">
            {tags
              .filter(({ id }) => DIVIDER_FILTERS.includes(id))
              .map(({ title, id }, index) => {
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
                    {dividerRenames['title'] ?? title}
                  </Tag>
                )
              })}
          </Inline>
        </Box>
      </Inline>
      <Box width="full" paddingY={2}>
        <Divider weight="red200" />
      </Box>
      <Box className={styles.filters}>
        <Box display="flex" marginRight={[0, 0, 0, 3]}>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              {tags
                .filter(({ id }) => !DIVIDER_FILTERS.includes(id))
                .map(({ title, id }, index) => {
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
          </Stack>
        </Box>
        <Box marginTop={[2, 2, 2, 0]}>
          <div className={styles.inputWrapper}>
            <input
              onChange={handleChange}
              placeholder={n('filterBySearchQuery', 'Sía eftir leitarorði')}
              className={styles.input}
            />
            <span className={styles.inputIcon}>
              {isLoading ? (
                <LoadingIcon size={24} color="red600" />
              ) : (
                <Icon
                  size="medium"
                  type="outline"
                  icon="search"
                  color="red600"
                />
              )}
            </span>
          </div>
        </Box>
      </Box>
      {batches.length === 0 ? (
        <Box marginTop={2}>
          <Stack space={2}>
            <Text color="red600">
              <span>Ekkert fannst með{` `}</span>
              {filterString
                ? `leitarorðinu „${filterString}“${
                    indexesFilteredByTag.length
                      ? ' og völdum málefnum hér fyrir ofan'
                      : ''
                  }`
                : null}
              {!filterString ? 'völdum málefnum hér fyrir ofan' : null}.
            </Text>
          </Stack>
        </Box>
      ) : null}
      <Box marginTop={3}>
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {batches.map(
            ({ title, description, tags, slug }: AdgerdirPage, index) => {
              return (
                <Card
                  key={index}
                  description={description}
                  title={title}
                  tags={tags.map(({ title, id }) => {
                    return {
                      id,
                      title,
                      tagProps: {
                        label: true,
                      },
                    }
                  })}
                  as={makePath('adgerdir', slug)}
                  href={makePath('adgerdir', '[slug]')}
                />
              )
            },
          )}
        </Tiles>
      </Box>
      {!showAll && showMoreButton ? (
        <Box marginY={3} width="full" display="flex" justifyContent="center">
          <Button
            onClick={() => {
              setShowCount(visibleItems.length)
            }}
            colorScheme="destructive"
          >
            {n('seeMoreItems2', 'Sjá allt')}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}

export default AdgerdirArticles
