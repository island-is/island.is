import {
  AsyncSearch,
  AsyncSearchOption,
  Breadcrumbs,
  Text,
} from '@island.is/island-ui/core'
import { useMemo, useRef, useState } from 'react'
import { LinkResolver, SearchPaths } from '@island.is/portals/my-pages/core'
import cn from 'classnames'

import * as styles from './SearchInput.css'
import { useNavigate } from 'react-router-dom'
import { usePortalModulesSearch } from '../../hooks/usePortalModulesSearch'

interface Props {
  white?: boolean
  colored?: boolean
}

export const SearchInput = ({ white, colored }: Props) => {
  const [query, setQuery] = useState<string>()
  const search = usePortalModulesSearch()

  const navigate = useNavigate()

  const ref = useRef<HTMLInputElement>(null)

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
              })}
            >
              <Breadcrumbs
                items={result.item.breadcrumbs.slice(1).map((b) => ({
                  title: b,
                }))}
              />
              <Text marginTop={1}>{result.item.description}</Text>
            </LinkResolver>
          )
        },
      }))
    }

    return []
  }, [search, query])

  return (
    <AsyncSearch
      ref={ref}
      id="my-pages-async-search"
      placeholder="Leita"
      colored={colored}
      white={white}
      options={searchResults ?? []}
      inputValue={query}
      openMenuOnFocus
      onSubmit={(_, option) => {
        if (option?.value) {
          navigate(option?.value)
        } else if (query) {
          navigate(`${SearchPaths.Search}?query=${query}`)
        } else navigate(SearchPaths.Search)
      }}
      onInputValueChange={(value) => {
        if (value && value !== query) {
          setQuery(value)
        }
      }}
    />
  )
}
