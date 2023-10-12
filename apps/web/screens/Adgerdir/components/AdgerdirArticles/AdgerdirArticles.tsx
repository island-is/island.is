import React, {
  FC,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import uniq from 'lodash/uniq'
import intersection from 'lodash/intersection'
import {
  Box,
  Tiles,
  Stack,
  Text,
  Inline,
  Icon,
  LoadingDots,
} from '@island.is/island-ui/core'
import { AdgerdirPage, AdgerdirTag } from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'
import { Card } from '../UI/Card/Card'
import { Button } from '../UI/Button/Button'
import { Tag } from '../UI/Tag/Tag'
import { ColorSchemeContext } from '../UI/ColorSchemeContext/ColorSchemeContext'
import {
  ADGERDIR_INDIVIDUALS_TAG_ID,
  ADGERDIR_COMPANIES_TAG_ID,
} from '@island.is/web/constants'

import * as styles from './AdgerdirArticles.css'
import * as covidStyles from '../UI/styles/styles.css'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

const FILTER_TIMER = 300
const ITEMS_PER_SHOW = 9

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

export const AdgerdirArticles: FC<
  React.PropsWithChildren<AdgerdirArticlesProps>
> = ({
  title,
  items,
  tags,
  currentArticle,
  showAll,
  namespace,
  startingIds = [],
}) => {
  const n = useNamespace(namespace)
  const { colorScheme } = useContext(ColorSchemeContext)
  const { linkResolver } = useLinkResolver()
  const [filterString, setFilterString] = useState<string>('')
  const [usableFilters, setUsableFilters] = useState<Array<AdgerdirTag['id']>>(
    [],
  )
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

  useEffect(() => {
    setUsableFilters(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      items.reduce((all, cur) => {
        const ids = cur.tags.map((x) => x.id)

        if (ids.length) {
          return uniq(ids.concat(all))
        }

        return all
      }, []),
    )
  }, [])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const handleChange = (e) => {
    e.preventDefault()
    setFilterString(e.target.value)
  }

  const onFilterStringChange = useCallback(() => {
    const arr: number[] = []

    visibleItems.forEach(({ title, description }, index) => {
      const str = `${title} ${description}`.trim()

      const invalid = /[°"§%()()[\]{}=\\?´`'#<>|,;.:+_-]+/g
      const cleanFilterString = filterString.replace(invalid, '')

      if (str.match(new RegExp(cleanFilterString.trim(), 'gi'))) {
        arr.push(index)
      }
    })

    setIndexesFilteredByString(arr)
  }, [visibleItems, filterString])

  const onFilterTagChange = useCallback(() => {
    const arr: number[] = []

    visibleItems.forEach(({ tags }, index) => {
      const ids = tags.map((x) => x.id)

      if (tagIds.every((id) => ids.includes(id))) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    clearTimeout(timerRef.current)
    setIsLoading(true)

    if (!filterString) {
      doUpdate()
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      timerRef.current = setTimeout(doUpdate, FILTER_TIMER)
    }
  }, [filterString, doUpdate])

  const onTagClick = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
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
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      clearTimeout(timerRef.current)
    }
  }, [onUpdateFilters])

  const filteredItems = visibleItems.filter((_, index) => {
    const indexList = [indexesFilteredByTag, indexesFilteredByString]

    return intersection(...indexList).includes(index)
  })

  const batches = [...filteredItems].splice(
    0,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
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
          <Text variant="h3" as="h3">
            <span className={covidStyles.text}>
              {title || n('adgerdirFor', 'Aðgerðir fyrir')}
            </span>
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
                    variant={colorScheme}
                    onClick={() => {
                      setstartingItems([])
                      onTagClick(id)
                    }}
                    active={tagIds.includes(id)}
                    bordered
                  >
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      dividerRenames[title] ?? title
                    }
                  </Tag>
                )
              })}
          </Inline>
        </Box>
      </Inline>
      <Box width="full" paddingY={2}>
        <Box className={covidStyles.divider} />
      </Box>
      <Box className={styles.filters}>
        <Box display="flex" marginRight={[0, 0, 0, 3]}>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              {tags
                .filter(
                  ({ id }) =>
                    !DIVIDER_FILTERS.includes(id) && usableFilters.includes(id),
                )
                .map(({ title, id }, index) => {
                  return (
                    <Tag
                      key={index}
                      variant={colorScheme}
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
                <span className={covidStyles.iconColor}>
                  <LoadingDots />
                </span>
              ) : (
                <Icon
                  size="medium"
                  type="outline"
                  icon="search"
                  className={covidStyles.iconColor}
                />
              )}
            </span>
          </div>
        </Box>
      </Box>
      {batches.length === 0 ? (
        <Box marginTop={2}>
          <Stack space={2}>
            <Text>
              <span className={covidStyles.text}>
                {n(
                  'nothingFoundWithSelectedFilters',
                  'Ekkert fannst með völdum málefnum og/eða leitarstreng',
                )}
              </span>
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
                  href={linkResolver('adgerdirpage', [slug]).href}
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
            variant="ghost"
          >
            {n('showAll', 'Sjá allt')}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}

export default AdgerdirArticles
