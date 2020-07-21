/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import {
  Box,
  Typography,
  Icon,
  Stack,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.treat'

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()
  const renderModuleNavTree = (nav: ServicePortalNavigationItem) => (
    <Box paddingLeft={5}>
      <Link to={nav.url}>
        <Box position="relative">
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
        <Box>
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
    </Box>
  )

  return (
    <aside className={styles.sidebar}>
      <Box padding="containerGutter" className={styles.sidebarContainer}>
        {navigationState.state === 'pending' ? (
          <SkeletonLoader />
        ) : (
          <>
            {navigation?.applications?.url && (
              <Box marginBottom={5}>
                <Stack space={[0, 2]}>
                  <Typography variant="h4" as="h4">
                    Aðgerðir
                  </Typography>
                  {renderModuleNavTree(navigation.applications)}
                </Stack>
              </Box>
            )}
            {navigation?.applications?.url && (
              <Stack space={[0, 2]}>
                <Typography variant="h4" as="h4">
                  Upplýsingar
                </Typography>
                {renderModuleNavTree(navigation.documents)}
              </Stack>
            )}
          </>
        )}
      </Box>
    </aside>
  )
}

export default Sidebar
