import React from 'react'

import { Box, Icon, IconMapIcon } from '@island.is/island-ui/core'

import * as styles from './IconButton.css'

interface Props {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red'
  onClick: () => void
}

const IconButton: React.FC<Props> = (props) => {
  const { icon, colorScheme, onClick } = props

  return (
    <Box
      component="button"
      className={styles.iconButtonContainer}
      background={colorScheme === 'blue' ? 'blue200' : 'red200'}
      onClick={() => onClick()}
    >
      <Icon
        icon={icon}
        color={colorScheme === 'blue' ? 'blue400' : 'red400'}
        size="small"
      />
    </Box>
  )
}

export default IconButton
