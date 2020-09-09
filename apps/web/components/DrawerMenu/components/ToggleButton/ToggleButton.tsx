import React from 'react'
import { Icon } from '@island.is/island-ui/core'
import * as styles from './ToggleButton.treat'

interface ToggleButtonProps {
  isActive: boolean
  onClick: () => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onClick }) => {
  return (
    <button
      className={styles.button}
      style={{ transform: isActive ? 'rotateZ(0)' : 'rotateZ(180deg)' }}
      onClick={onClick}
    >
      <Icon type="cheveron" color="purple400" width={14} />
    </button>
  )
}

export default ToggleButton
