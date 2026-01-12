import { FC, PropsWithChildren } from 'react'
import cn from 'classnames'

import { TestSupport } from '@island.is/island-ui/utils'

import * as styles from './BlueBox.css'

interface Props {
  dataTestId?: string
  className?: string
}

const BlueBox: FC<PropsWithChildren<Props & TestSupport>> = (props) => {
  const { children, dataTestId, className } = props

  return (
    <div
      className={cn(styles.BlueBoxContainer, className)}
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

export default BlueBox
