import { FC, PropsWithChildren } from 'react'

import { Box } from '@island.is/island-ui/core'

import * as styles from './FormContentContainer.css'

interface Props {
  isFooter?: boolean
}

const FormContentContainer: FC<PropsWithChildren<Props>> = ({
  isFooter,
  children,
}) => {
  const renderContainer = () => (
    <Box paddingX={[3, 3, 3, 6, 14]}>{children}</Box>
  )

  return isFooter ? (
    <div className={styles.footerContainer}>{renderContainer()}</div>
  ) : (
    renderContainer()
  )
}

export default FormContentContainer
