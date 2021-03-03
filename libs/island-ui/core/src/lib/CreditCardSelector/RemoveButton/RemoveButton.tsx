import * as React from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import { Icon } from '../../IconRC/Icon'
import * as styles from './RemoveButton.treat'

type RemoveButtonProps = {
  onClick: () => void
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick }) => (
  <button className={cn(styles.root)}>
    <span className={styles.icon} />
  </button>
)
