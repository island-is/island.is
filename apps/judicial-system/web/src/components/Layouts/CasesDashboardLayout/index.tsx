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
    <section>
      <SectionHeading title={title} />
      <Box className={styles.gridContainer}>{children}</Box>
    </section>
  )
}

export default CasesDashboardLayout
