import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalPaths, m } from '@island.is/portals/my-pages/core'
import { useMemo, useRef, useState } from 'react'
import * as styles from './Search.css'
import { usePortalModulesSearch } from '../../hooks/usePortalModulesSearch'

const Search = () => {
  const { formatMessage } = useLocale()
  const search = usePortalModulesSearch()

  const breadcrumbs: Array<BreadCrumbItem> = [
    {
      title: formatMessage(m.overview),
      href: ServicePortalPaths.Base,
    },
    {
      title: formatMessage(m.searchOnMyPages),
      isCurrentPage: true,
      isTag: true,
    },
  ]

  const ref = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState<string>('')

  const searchResults = useMemo(() => {
    if (query && query.length > 1) {
      return search(query)
    }
    return []
  }, [search, query])

  const hitsMessage = useMemo(() => {
    if (!searchResults.length) {
      return
    }
    if (searchResults.length === 1) {
      return formatMessage(m.resultFound, {
        arg: <strong>{searchResults.length}</strong>,
      })
    }
    return formatMessage(m.resultsFound, {
      arg: <strong>{searchResults.length}</strong>,
    })
  }, [formatMessage, searchResults])

  return (
    <GridContainer>
      <GridRow>
        <GridColumn offset="2/12" span="5/12">
          <Breadcrumbs items={breadcrumbs}></Breadcrumbs>

          <Box marginTop={3}>
            <Input
              ref={ref}
              name="search-input"
              placeholder={formatMessage(m.searchLabel)}
              backgroundColor="blue"
              aria-label="Search input"
              onKeyDown={(e) => {
                if (e.code === 'Enter' && ref.current?.value) {
                  setQuery(ref.current.value)
                }
              }}
              icon={{
                name: 'search',
                type: 'outline',
              }}
              className={styles.searchBox}
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow marginTop={4}>
        <GridColumn offset="2/12" span="8/12">
          <Text marginBottom={2}>{hitsMessage}</Text>
          <Stack space={3}>
            {searchResults?.map((s) => {
              return (
                <CategoryCard
                  autoStack
                  hyphenate
                  truncateHeading
                  component={Link}
                  href={`${ServicePortalPaths.Base}${s.item.uri}`}
                  icon={
                    s.item.icon ? (
                      <Icon
                        icon={s.item.icon.icon}
                        type="outline"
                        color="blue400"
                      />
                    ) : undefined
                  }
                  heading={formatMessage(s.item.title)}
                  text={
                    s.item.description ? formatMessage(s.item.description) : ''
                  }
                />
              )
            })}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Search
