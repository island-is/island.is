import {
  Box,
  Breadcrumbs as IslandUIBreadcrumbs,
  Divider,
  GridContainer,
  Hidden,
} from '@island.is/island-ui/core'

export const Breadcrumbs = ({ items }) => {
  return (
    <>
      <GridContainer>
        <Box paddingY={[3, 3, 3, 5, 5]}>
          <IslandUIBreadcrumbs items={items} />
        </Box>
      </GridContainer>
      <Hidden above="sm">
        <Box paddingBottom={[3, 3, 3, 5, 5]}>
          <Divider />
        </Box>
      </Hidden>
    </>
  )
}

export default Breadcrumbs
