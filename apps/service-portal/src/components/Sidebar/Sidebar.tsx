/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { Box, Typography, Icon, Stack } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.treat'

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()
  const renderModuleNavTree = (nav: ServicePortalNavigationItem) => (
    <>
      <Link to={nav.url}>
        <Box marginTop={1}>
          {nav.icon && (
            <span className={styles.iconWrapper}>
              <Icon type={nav.icon} />
            </span>
          )}
          <Typography variant="p" as="span">
            {nav.name}
          </Typography>
        </Box>
      </Link>
      {nav.children && (
        <Box paddingLeft={1}>
          {nav.children.map((child, index) => (
            <Link to={child.url} key={`child-${index}`}>
              <Box>
                <Typography variant="pSmall" as="span">
                  {child.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </>
  )

  if (navigationState.state === 'pending') return <div>loading</div>

  return (
    <aside className={styles.sidebar}>
      <Box padding="containerGutter" className={styles.sidebarContainer}>
        <Stack space={[0, 2]}>
          {navigation?.applications?.url &&
            renderModuleNavTree(navigation.applications)}
          {navigation?.documents?.url &&
            renderModuleNavTree(navigation.documents)}
        </Stack>
      </Box>
    </aside>
  )
}

export default Sidebar
