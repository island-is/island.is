import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './LinkButton.treat'
import { Link } from 'react-router-dom'

interface Props {
  onClick?: () => void
  url?: string
}

const ButtonContent: FC<Props> = ({ onClick, children }) => (
  <Box
    display="flex"
    alignItems="center"
    className={styles.wrapper}
    onClick={onClick}
  >
    {children}
  </Box>
)

const LinkButton: FC<Props> = (props) => {
  return props.url ? (
    <Link to={props.url} className={styles.link}>
      <ButtonContent {...props} />
    </Link>
  ) : (
    <ButtonContent {...props} />
  )
}

export default LinkButton
