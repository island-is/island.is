import { FC, PropsWithChildren } from 'react'

import { Box } from '@island.is/island-ui/core'

import SectionHeading from '../../SectionHeading/SectionHeading'
import * as styles from './index.css'

interface Props {
  title: string
}

const CasesDashboardLayout: FC<PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <>
      <SectionHeading title={title} />
      <Box marginBottom={[5, 5, 6]} className={styles.gridContainer}>
        {children}
      </Box>
    </>
  )
}

export default CasesDashboardLayout
