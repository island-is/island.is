import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
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

  return (
    <GridContainer>
      <GridRow>
        <GridColumn offset="2/12" span="5/12">
          <Breadcrumbs items={breadcrumbs}></Breadcrumbs>

          <Box marginTop={3}>
            <Input
              ref={ref}
              name="search-input"
              placeholder="Leita"
              backgroundColor="blue"
              aria-label="Search input"
              onClick={() => console.log('click')}
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
          <Box display="flex" justifyContent="spaceBetween">
            <Text>{`${searchResults.length} leitarniðurstöður fundust`}</Text>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Search
