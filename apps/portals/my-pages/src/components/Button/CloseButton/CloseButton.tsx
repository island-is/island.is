import { Icon } from '@island.is/island-ui/core'
import * as styles from './CloseButton.css'

interface Props {
  onClick: () => void
  ariaLabel?: string
}

export const CloseButton = ({ onClick, ariaLabel }: Props) => (
  <button
    className={styles.closeButton}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Icon icon="close" color="black" />
  </button>
)
