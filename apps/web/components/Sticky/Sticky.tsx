import React, { FC } from 'react'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'
import * as styles from './Sticky.treat'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  top?: number
}

export const Sticky: FC<Props> = ({
  children,
  top = STICKY_NAV_HEIGHT + theme.spacing[1],
}) => {
  return (
    <div className={styles.sticky} style={{ top }}>
      {children}
    </div>
  )
}

export default Sticky
