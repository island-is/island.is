import { useIsMobile } from '../../hooks'
import {
  Box,
  Breadcrumbs as IslandUIBreadcrumbs,
  Divider,
  GridContainer,
} from '@island.is/island-ui/core'

export const Breadcrumbs = ({ items }) => {
  const { isMobile } = useIsMobile()
  return (
    <>
      <GridContainer>
        <Box paddingY={[3, 3, 3, 5, 5]}>
          <IslandUIBreadcrumbs items={items} />
        </Box>
      </GridContainer>
      {isMobile && (
        <Box paddingBottom={[3, 3, 3, 5, 5]}>
          <Divider />
        </Box>
      )}
    </>
  )
}

export default Breadcrumbs
