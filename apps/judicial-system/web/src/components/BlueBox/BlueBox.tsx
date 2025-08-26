import { FC, PropsWithChildren } from 'react'

import { TestSupport } from '@island.is/island-ui/utils'

import * as styles from './BlueBox.css'

interface Props {
  dataTestId?: string
}

const BlueBox: FC<PropsWithChildren<Props & TestSupport>> = (props) => {
  const { children, dataTestId } = props

  return (
    <div className={styles.BlueBoxContainer} data-testid={dataTestId}>
      {children}
    </div>
  )
}

export default BlueBox
