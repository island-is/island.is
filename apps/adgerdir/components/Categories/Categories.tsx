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
  const [filterString, setFilterString] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hiddenIndexes, setHiddenIndexes] = useState<Array<number>>([])
  const timerRef = useRef(null)

  const tags = [
    'Styrkir',
    'Bætur',
    'Lán',
    'Skattamál',
    'Einstaklingar',
    'Fyrirtæki',
    'Atvinnulíf',
    'Ferðaþjónusta',
    'Tölfræði',
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

  useEffect(() => {
    onUpdateFilters()
    return () => clearTimeout(timerRef.current)
  }, [onUpdateFilters])

  const filteredItems = items.filter(
    (_, index) => !hiddenIndexes.includes(index),
  )

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
                {tags.map((tag, index) => {
                  return (
                    <Tag key={index} variant="red">
                      {tag}
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
        <Box textAlign="center">
          <Button
            onClick={() => {
              console.log('load more cards...')
            }}
            variant="ghost"
          >
            {seeMoreText}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default Categories
