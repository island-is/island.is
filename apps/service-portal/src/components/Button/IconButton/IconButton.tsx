import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Icon, IconProps, Text } from '@island.is/island-ui/core'
import * as styles from './IconButton.css'

interface Props {
  icon: Pick<IconProps, 'icon' | 'type'> | undefined
  onClick?: () => void
  url?: string
  active?: boolean
}

const ButtonContent: FC<React.PropsWithChildren<Props>> = ({
  icon,
  active,
  onClick,
  children,
}) => (
  <Box display="flex" alignItems="center" cursor="pointer" onClick={onClick}>
    <Box marginRight={2}>
      {icon ? (
        <Icon
          type={icon.type}
          icon={icon.icon}
          color={active ? 'purple400' : 'dark300'}
        />
      ) : null}
    </Box>
    <Text variant={active ? 'h5' : 'default'} as="span">
      {children}
    </Text>
  </Box>
)

const IconButton: FC<React.PropsWithChildren<Props>> = (props) => {
  return props.url ? (
    <Link to={props.url} className={styles.link}>
      <ButtonContent {...props} />
    </Link>
  ) : (
    <ButtonContent {...props} />
  )
}

export default IconButton
