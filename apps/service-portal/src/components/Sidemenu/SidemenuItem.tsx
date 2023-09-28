import React, { ReactElement } from 'react'
import { Box, Hyphen, Icon } from '@island.is/island-ui/core'
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
  let itemText = formatMessage(item.name)
  const itemTextLength = itemText.length
  const itemTextHover = itemTextLength > 17
  if (itemTextHover) {
    itemText = itemText.slice(0, 16).padEnd(17, '.')
  }

  return (
    <Box position="relative" className={styles.itemContainer}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="standard"
        borderColor={isHovered ? 'blue400' : 'blue200'}
        borderRadius="standard"
        className={cn(styles.itemBlock, {
          [`${styles.item}`]: itemTextHover || item.active,
        })}
        background="white"
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
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            paddingX={1}
            position={
              item.subscribesTo === 'documents' ? 'relative' : undefined
            }
            paddingY={2}
          >
            {item.icon && (
              <Box className={styles.icon}>
                <Icon icon={item.icon.icon} type="outline" color="blue400" />
              </Box>
            )}
            <p className={styles.itemText}>{itemText}</p>
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default SidemenuItem
