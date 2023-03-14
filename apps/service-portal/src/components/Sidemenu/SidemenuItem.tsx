import React, { ReactElement } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import * as styles from './Sidemenu.css'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import { useListDocuments } from '@island.is/service-portal/graphql'
import { PortalNavigationItem } from '@island.is/portals/core'
import { useToggle } from 'react-use'

interface Props {
  item: PortalNavigationItem
  setSidemenuOpen: (open: boolean) => void
}
const SidemenuItem = ({
  item,
  setSidemenuOpen,
}: Props): ReactElement | null => {
  useNamespaces(['service.portal'])
  const { formatMessage } = useLocale()
  const [isHovered, toggleIsHovered] = useToggle(false)

  const { unreadCounter } = useListDocuments()

  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'
  const fullWidth = item.isKeyItem
  let itemText = formatMessage(item.name)
  const itemTextLength = itemText.length
  if (itemTextLength > 11 && !fullWidth) {
    itemText = itemText.slice(0, 10).padEnd(11, '.')
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="standard"
      borderColor="blue200"
      borderRadius="standard"
      flexGrow={fullWidth ? 1 : 0}
      width={fullWidth ? 'full' : undefined}
      className={cn(styles.item, !fullWidth && styles.smallItem)}
      onMouseEnter={(value) => toggleIsHovered(value)}
      onMouseLeave={(value) => toggleIsHovered(value)}
    >
      <Link
        to={item.path ?? '/'}
        onClick={() => setSidemenuOpen(false)}
        className={styles.itemLink}
      >
        <Box
          display="flex"
          flexDirection={fullWidth ? 'row' : 'column'}
          alignItems="center"
          justifyContent="center"
          position={item.subscribesTo === 'documents' ? 'relative' : undefined}
          paddingY={2}
        >
          {item.icon && (
            <Box className={fullWidth ? styles.icon : styles.iconSmall}>
              <Icon icon={item.icon.icon} type="outline" color="blue400" />
            </Box>
          )}
          <p className={styles.itemText}>
            {isHovered && itemTextLength > 11
              ? formatMessage(item.name)
              : itemText}
          </p>
        </Box>
      </Link>
    </Box>
  )
}

export default SidemenuItem
