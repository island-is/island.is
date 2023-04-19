import {
  Box,
  Breadcrumbs,
  Divider,
  GridContainer,
  Hidden,
} from '@island.is/island-ui/core'

export const BreadcrumbsWithMobileDivider = ({ items }) => {
  return (
    <>
      <GridContainer>
        <Box paddingY={[3, 3, 3, 5, 5]}>
          <Breadcrumbs items={items} />
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

export default BreadcrumbsWithMobileDivider
