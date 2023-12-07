import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import SubNavItem from './SubNavItem'
import * as styles from '../Sidebar.css'

interface Props {
  navChildren?: ServicePortalNavigationItem[]
  pathname?: string
  collapsed?: boolean
  onItemClick?: () => void
}

const SubNav = ({ navChildren, onItemClick, pathname, collapsed }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      className={collapsed ? styles.subnavCollapsed : styles.subnav}
      marginTop={collapsed ? 0 : 2}
      marginBottom={collapsed ? 0 : 1}
    >
      {navChildren?.map((child, index) => (
        <SubNavItem
          first={index === 0}
          path={child.path}
          enabled={child.enabled}
          collapsed={collapsed}
          key={`child-${index}`}
          active={child.path && pathname?.includes(child.path) ? true : false}
          external={child.external}
          onClick={onItemClick}
        >
          {formatMessage(child.name)}
        </SubNavItem>
      ))}
    </Box>
  )
}

export default SubNav
