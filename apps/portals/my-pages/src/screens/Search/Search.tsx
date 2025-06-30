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
import { useMemo, useRef } from 'react'
import * as styles from './Search.css'
import { usePortalModulesSearch } from '../../hooks/usePortalModulesSearch'
import { useSearchParams } from 'react-router-dom'
import { Problem } from '@island.is/react-spa/shared'

const Search = () => {
  const { formatMessage } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
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

  const query = searchParams.get('query')

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
        <GridColumn offset={['0', '0', '2/12']} span={['6/6', '6/6', '5/12']}>
          <Breadcrumbs items={breadcrumbs}></Breadcrumbs>

          <Box marginTop={3}>
            <Input
              ref={ref}
              size="xs"
              name="search-input"
              placeholder={formatMessage(m.searchPlaceholder)}
              backgroundColor="blue"
              aria-label="Search input"
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  const val = ref.current?.value
                  if (!val) {
                    setSearchParams(
                      (params) => {
                        const newParams = params
                        newParams.delete('query')
                        return newParams
                      },
                      { replace: true },
                    )
                  } else {
                    setSearchParams(
                      (params) => {
                        const newParams = params
                        newParams.set('query', val)
                        return newParams
                      },
                      { replace: true },
                    )
                  }
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
      <GridRow marginTop={4} marginBottom={3}>
        <GridColumn offset={['0', '0', '2/12']} span={['6/6', '6/6', '8/12']}>
          {!query && (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(m.nothing)}
              message={formatMessage(m.searchForResults)}
              imgSrc="./assets/images/bench.svg"
            />
          )}
          {searchResults.length < 1 && query && (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(m.noSearchResults)}
              message={formatMessage(m.noSearchResultsText, {
                arg: <strong>{query}</strong>,
              })}
              imgSrc="./assets/images/sofa.svg"
            />
          )}
          {searchResults.length > 0 && (
            <>
              <Text marginBottom={2}>{hitsMessage}</Text>
              <Stack space={3}>
                {searchResults?.map((s) => {
                  return (
                    <CategoryCard
                      key={s.item.uri}
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
                        s.item.description
                          ? formatMessage(s.item.description)
                          : ''
                      }
                    />
                  )
                })}
              </Stack>
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Search
