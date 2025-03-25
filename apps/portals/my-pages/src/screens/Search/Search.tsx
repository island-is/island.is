import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { SearchInput } from '../../components/SearchInput/SearchInput'
import { useLocale } from '@island.is/localization'
import { ServicePortalPaths, m } from '@island.is/portals/my-pages/core'

const Search = () => {
  const { formatMessage } = useLocale()
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

  return (
    <GridContainer>
      <GridRow>
        <GridColumn offset="2/12" span="8/12">
          <Breadcrumbs items={breadcrumbs}></Breadcrumbs>
          <Box marginTop={3}>
            <SearchInput colored />
            <Text>bongbong</Text>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Search
