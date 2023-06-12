import React, { FC } from 'react'
import { Box, Button, Icon } from '@island.is/island-ui/core'

import * as styles from './HeaderArrow.css'

interface Props {
  direction?: 'Ascending' | 'Descending'
  active?: boolean
  onClick?: () => void
  title?: string
}

export const HeaderArrow: FC<React.PropsWithChildren<Props>> = ({
  onClick,
  direction,
  title,
  active,
}) => {
  return (
    <Button variant="text" size="small" onClick={onClick}>
      <Box
        className={styles.item}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <span className={styles.title}>{title}</span>
        {active && (
          <Box marginLeft={[0, 0, 0, 'p1']} display="flex">
            {direction === 'Ascending' && (
              <Icon color="dark400" icon="chevronUp" size="small" />
            )}
            {direction === 'Descending' && (
              <Icon color="dark400" icon="chevronDown" size="small" />
            )}
          </Box>
        )}
      </Box>
    </Button>
  )
}

export default HeaderArrow
