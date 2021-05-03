import React, { ReactNode, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
} from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

interface PageProps {
  children: ReactNode
  activeSection?: number
}

const FormLayout: React.FC<PageProps> = ({ children, activeSection }) => {
  
  const sections = [
    {
      name: 'Gagnaöflun',
    },
    {
      name: 'Tengiliðaupplýsingar',
    },
    {
      name: 'Heimili',
    },
    {
      name: 'Búseta',
    },
    {
      name: 'Staða',
    },
    {
      name: 'Tekjur',
    },
    {
      name: 'Persónuafsláttur',
    },
    {
      name: 'Bankaupplýsingar',
    },
    {
      name: 'Útreikningur',
    },
    {
      name: 'Staðfesting',
    },
  ]

  return children ? (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
            <Box
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.processContent}
            >
              {children}
            </Box>
          </GridColumn>
          <GridColumn span={['0', '0', '3/12', '3/12']}>
            <Box marginLeft={2}>
              <FormStepper sections={sections} activeSection={activeSection} />
            </Box>
            
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default FormLayout
