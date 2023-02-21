import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './DomainsLayout.css'

interface DomainsLayoutProps {
  children: React.ReactNode
}
const DomainsLayout: React.FC<DomainsLayoutProps> = ({ children }) => {
  return (
    <Box className={styles.layoutConteiner}>
      <GridContainer>
        <GridRow>
          <GridColumn span="3/12">nav</GridColumn>
          <GridColumn span="9/12">content</GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default DomainsLayout
