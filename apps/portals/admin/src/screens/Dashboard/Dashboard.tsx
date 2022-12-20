import {
  Box,
  CategoryCard,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  useBreakpoint,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { PortalNavigationItem } from '@island.is/portals/core'
import { m as adminMessages } from '@island.is/portals/admin/core'
import * as styles from './Dashboard.css'
import { useAdminNavigation } from '../../hooks/useAdminNavigation'

export const Dashboard = () => {
  const { formatMessage } = useLocale()
  const { topNavigation, bottomNavigation } = useAdminNavigation()
  const { md } = useBreakpoint()

  const renderNavItem = (item: PortalNavigationItem, index: number) => (
    <GridColumn
      span={['12/12', '12/12', '12/12', '4/12']}
      key={`${formatMessage(item.name)}-${index}`}
    >
      {item.path && (
        <CategoryCard
          autoStack
          hyphenate
          truncateHeading
          component={Link}
          to={item.path}
          icon={
            item.icon ? (
              <Icon icon={item.icon.icon} type="outline" color="blue400" />
            ) : undefined
          }
          heading={formatMessage(item.name)}
          text={item.description ? formatMessage(item.description) : ''}
        />
      )}
    </GridColumn>
  )

  return (
    <GridContainer className={styles.relative}>
      <GridRow marginTop={[6, 6, 6, 15]} marginBottom={6}>
        <GridColumn
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '10/12']}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            columnGap={[0, 0, 0, 3]}
          >
            <Box display="flex" flexDirection="column" rowGap={3}>
              <Text variant="h2" as="h1">
                {formatMessage(adminMessages.dashboardTitle)}
              </Text>
              <Text>{formatMessage(adminMessages.dashboardIntro)}</Text>
            </Box>
            {md && (
              <img
                src="./assets/images/adminOverview.svg"
                alt={formatMessage(adminMessages.dashboardImageAlt)}
                className={styles.img}
              />
            )}
          </Box>
          <Box display="flex" flexDirection="column" rowGap={6} marginTop={5}>
            <GridRow rowGap={3}>{topNavigation.map(renderNavItem)}</GridRow>
            {bottomNavigation.length > 0 && (
              <>
                <Divider />
                <GridRow rowGap={3}>
                  {bottomNavigation.map(renderNavItem)}
                </GridRow>
              </>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
