import { useIsMobile } from '../../hooks'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs as IslandUIBreadcrumbs,
  Divider,
  GridContainer,
  ResponsiveSpace,
} from '@island.is/island-ui/core'

interface Props {
  items: Array<BreadCrumbItem>
}

export const Breadcrumbs = ({ items }: Props) => {
  const { isMobile } = useIsMobile()
  const padding = [3, 3, 3, 5, 5] as ResponsiveSpace

  return (
    <>
      <GridContainer>
        <Box paddingY={padding}>
          <IslandUIBreadcrumbs items={items} />
        </Box>
      </GridContainer>
      {isMobile && (
        <Box paddingBottom={padding}>
          <Divider />
        </Box>
      )}
    </>
  )
}

export default Breadcrumbs
