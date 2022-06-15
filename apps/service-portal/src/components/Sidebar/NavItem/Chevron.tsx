import { Box, Icon } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useStore } from '../../../store/stateProvider'
import * as styles from './NavItem.css'

interface ChevronProps {
  expanded?: boolean
  enabled?: boolean
  active: boolean
  onChevronClick?: () => void
}

const Chevron: FC<ChevronProps> = ({
  expanded,
  enabled,
  active,
  onChevronClick,
}) => {
  const chevronIcon = expanded ? 'chevronUp' : 'chevronDown'
  const [{ sidebarState }] = useStore()
  const showChevron = enabled && sidebarState === 'open'

  return showChevron ? (
    <Box
      onClick={() => {
        onChevronClick && onChevronClick()
      }}
      className={styles.iconWrapper}
    >
      <Icon
        type="filled"
        icon={chevronIcon}
        size="medium"
        color={active ? 'blue400' : 'blue600'}
        className={styles.icon}
      />
    </Box>
  ) : null
}

export default Chevron
