import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  BoxProps,
  Button,
  ColorSchemeContext,
  Text,
} from '@island.is/island-ui/core'
import { LinkResolver, SearchPaths } from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

import * as styles from './SearchInput.css'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePortalModulesSearch } from '../../hooks/usePortalModulesSearch'

interface Props {
  colorScheme?: 'blue' | 'default'
  box?: BoxProps
  size?: 'large' | 'default'
  placeholder?: string
  buttonAriaLabel?: string
  hideInput?: boolean
  whiteMenuBackground?: boolean
}

export const SearchInput = ({
  box,
  colorScheme = 'default',
  size = 'default',
  placeholder,
  buttonAriaLabel,
  hideInput,
  whiteMenuBackground,
}: Props) => {
  const [query, setQuery] = useState<string>()
  const search = usePortalModulesSearch()

  const navigate = useNavigate()

  const ref = useRef<HTMLInputElement>(null)
  const [searchParams] = useSearchParams()

  const searchQuery = searchParams.get('query')

  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const searchResults: Array<AsyncSearchOption> = useMemo(() => {
    if (query && query.length > 1) {
      const results = search(query, {
        limit: 5,
      })

      if (results?.length <= 0) {
        return []
      }

      return results.map((result) => ({
        label: result.item.title,
        value: result.item.uri,
        component: ({ active }) => {
          return (
            <LinkResolver
              href={result.item.uri}
              className={cn(styles.item, {
                [styles.active]: active,
                [styles.blueBackground]: !whiteMenuBackground,
                [styles.whiteBackground]: whiteMenuBackground,
              })}
            >
              <Box
                display="inlineFlex"
                alignItems="center"
                flexWrap="wrap"
                position="relative"
              >
                {result.item.breadcrumbs.slice(1).map((crumb, idx) => (
                  <>
                    <Box key={`${crumb}-${idx}`} className={styles.breadcrumb}>
                      <Text variant="eyebrow" color="blue400">
                        {crumb}
                      </Text>
                    </Box>
                    {idx < result.item.breadcrumbs.length - 2 && (
                      <Box
                        key={`crumb-bullet-${idx}`}
                        borderRadius="full"
                        background="blue400"
                        display={'inlineBlock'}
                        marginY={0}
                        className={styles.bullet}
                      />
                    )}
                  </>
                ))}
              </Box>
              <Text marginTop={1}>{result.item.description}</Text>
            </LinkResolver>
          )
        },
      }))
    }

    return []
  }, [query, search, whiteMenuBackground])

  if (hideInput) {
    return (
      <Box className={styles.wrapper} {...box}>
        <LinkResolver href={SearchPaths.Search} className={styles.searchButton}>
          <Button
            aria-label={buttonAriaLabel}
            icon="search"
            iconType="outline"
            colorScheme="white"
            size="small"
            type="span"
            as="span"
            variant="utility"
            unfocusable
          />
        </LinkResolver>
      </Box>
    )
  }

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme: colorScheme === 'blue' ? 'blue' : null,
      }}
    >
      <Box className={styles.wrapper} {...box}>
        <AsyncSearch
          ref={ref}
          id="my-pages-async-search"
          ariaLabel={buttonAriaLabel}
          placeholder={placeholder}
          size={size === 'large' ? 'semi-large' : 'medium'}
          colored={!whiteMenuBackground}
          options={searchResults ?? []}
          inputValue={query}
          openMenuOnFocus
          showDividerIfActive
          closeMenuOnSubmit
          initialInputValue={query ?? ''}
          onSubmit={(_, option) => {
            if (option?.value) {
              navigate(option?.value)
              setQuery(option?.value)
            } else if (query) {
              navigate(`${SearchPaths.Search}?query=${query}`)
              setQuery(query)
            } else navigate(SearchPaths.Search)
          }}
          onInputValueChange={(value) => {
            if (value !== query) {
              setQuery(value)
            }
          }}
          onChange={(value) => {
            if (value?.value !== query) {
              setQuery(value?.value)
            }
          }}
        />
      </Box>
    </ColorSchemeContext.Provider>
  )
}
