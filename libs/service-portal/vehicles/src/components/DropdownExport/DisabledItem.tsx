import React, { FC } from 'react'
import { LoadingDots } from '@island.is/island-ui/core'
import * as styles from './DropdownExport.css'

interface Props {
  title: string
  loading?: boolean
}

const DisabledDropdownItem: FC<React.PropsWithChildren<Props>> = ({
  title,
  loading,
}) => {
  return (
    <div className={styles.disabledItem}>
      <span>{title}</span>
      {loading && (
        <span className={styles.loadingDots}>
          <LoadingDots />
        </span>
      )}
    </div>
  )
}

export default DisabledDropdownItem
