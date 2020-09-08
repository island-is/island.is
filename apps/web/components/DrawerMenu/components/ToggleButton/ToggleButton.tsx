import React, { useState } from 'react'
import * as styles from './ToggleButton.treat'
import Icon from '../../../Icon/Icon'

interface ToggleButtonProps {
  isActive: boolean
  onClick: () => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onClick }) => {
  return (
    <button className={styles.button}>
      <Icon type="cheveron" color="purple400" width={14} />
    </button>
  )
}

export default ToggleButton
