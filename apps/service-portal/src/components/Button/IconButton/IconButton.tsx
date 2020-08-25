import React, { FC } from 'react'
import { Box, Icon, Typography, IconTypes } from '@island.is/island-ui/core'
import * as styles from './IconButton.treat'
import { Link } from 'react-router-dom'
import cn from 'classnames'

interface Props {
  icon: IconTypes
  onClick?: () => void
  url?: string
  active?: boolean
}

const ButtonContent: FC<Props> = ({ icon, active, onClick, children }) => (
  <Box
    display="flex"
    alignItems="center"
    cursor="pointer"
    className={cn(styles.wrapper, {
      [styles.active]: active,
    })}
    onClick={onClick}
  >
    <Box marginRight={2}>
      <Icon type={icon} color={active ? 'purple400' : 'dark300'} />
    </Box>
    <Typography variant={active ? 'h5' : 'p'} as="span">
      {children}
    </Typography>
  </Box>
)

const IconButton: FC<Props> = (props) => {
  return props.url ? (
    <Link to={props.url} className={styles.link}>
      <ButtonContent {...props} />
    </Link>
  ) : (
    <ButtonContent {...props} />
  )
}

export default IconButton
