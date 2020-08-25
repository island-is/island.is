import React, { FC, useState, useCallback, useEffect, useRef } from 'react'
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

import * as styles from './Categories.treat'
import { Card } from '..'

const FILTER_TIMER = 1000
const ITEMS_PER_SHOW = 6

export interface ItemProps {
  title: string
  description: string
}

interface CategoriesProps {
  items: Array<ItemProps>
  seeMoreText?: string
}

export const Categories: FC<CategoriesProps> = ({
  seeMoreText = 'Sjá fleiri',
  items,
}) => {
  // const cardsRef = useRef<Array<HTMLElement | null>>([])
  const [filterString, setFilterString] = useState<string>('')
  const [tagIds, setTagIds] = useState<Array<number | string>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCount, setShowCount] = useState<number>(ITEMS_PER_SHOW)
  const [hiddenIndexes, setHiddenIndexes] = useState<Array<number>>([])
  const timerRef = useRef(null)

  const tags = [
    { title: 'Styrkir', id: 1 },
    { title: 'Bætur', id: 2 },
    { title: 'Lán', id: 3 },
    { title: 'Skattamál', id: 4 },
    { title: 'Einstaklingar', id: 5 },
    { title: 'Fyrirtæki', id: 6 },
    { title: 'Atvinnulíf', id: 7 },
    { title: 'Ferðaþjónusta', id: 8 },
    { title: 'Tölfræði', id: 9 },
  ]

  const states = ['Í undirbúningi', 'Í framkvæmd', 'Lokið']

  const handleChange = (e) => {
    e.preventDefault()
    setFilterString(e.target.value)
  }

  const doUpdate = useCallback(() => {
    const indexesToHide = []

    if (items.length) {
      items.forEach(({ title, description }, index) => {
        const str = `${title} ${description}`

        if (!str.match(new RegExp(filterString.trim(), 'gi'))) {
          indexesToHide.push(index)
        }
      })
    }

    setHiddenIndexes(indexesToHide)
    setIsLoading(false)
  }, [items, filterString])

  const onUpdateFilters = useCallback(() => {
    setIsLoading(true)
    clearTimeout(timerRef.current)

    if (!filterString) {
      doUpdate()
    } else {
      timerRef.current = setTimeout(doUpdate, FILTER_TIMER)
    }
  }, [filterString, doUpdate])

  const onTagClick = (id: number | string) => {
    const newTagIds = [...tagIds]
    const index = tagIds.findIndex((x) => x === id)

    if (index < 0) {
      newTagIds.push(id)
    } else {
      newTagIds.splice(index, 1)
    }

    setTagIds(newTagIds)
  }

  useEffect(() => {
    onUpdateFilters()
    return () => clearTimeout(timerRef.current)
  }, [onUpdateFilters])

  const filteredItems = items
    .filter((_, index) => !hiddenIndexes.includes(index))
    .splice(0, showCount)

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
                {states.map((tag, index) => {
                  return (
                    <Tag key={index} variant="red" active>
                      {tag}
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
        {filterString && filteredItems.length === 0 ? (
          <Box>
            <Typography variant="h5">
              Ekkert fannst með leitarorðinu „{filterString}“.
            </Typography>
          </Box>
        ) : null}
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {filteredItems.map(({ title, description }: ItemProps, index) => {
            return (
              <Card
                key={index}
                description={description}
                title={title}
                tags={[
                  { title: 'Styrkir', tagProps: { variant: 'red' } },
                  { title: 'Lán', tagProps: { variant: 'red' } },
                  { title: 'Atvinnulíf', tagProps: { variant: 'red' } },
                ]}
              />
            )
          })}
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

export default Categories
