import React, { ReactNode, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
} from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import { LogoHfj } from '../../components'

interface PageProps {
  children: ReactNode
  activeSection?: number
}

const FormLayout: React.FC<PageProps> = ({ children, activeSection }) => {
  const sections = [
    {
      name: 'Gagnaöflun',
      url: 'lol',
    },
    {
      name: 'Heimili',
      url: 'lol',
    },
    {
      name: 'Búseta',
      url: 'lol',
    },
    {
      name: 'Staða',
      url: 'lol',
    },
    {
      name: 'Tekjur',
      url: 'lol',
    },
    {
      name: 'Persónuafsláttur',
      url: 'lol',
    },
    {
      name: 'Bankaupplýsingar',
      url: 'lol',
    },
    {
      name: 'Útreikningur',
      url: 'lol',
    },
    {
      name: 'Staðfesting',
      url: 'lol',
    },
  ]

  return children ? (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      <GridContainer className={styles.gridContainer}>
        {/* Took out GridRow and GridColumn, mobile was getting too difficult so I refactored */}
        <div className={styles.gridRowContainer}>
          <Box
            background="white"
            borderColor="white"
            borderRadius="large"
            className={styles.formContainer}
          >
            {children}
          </Box>

          <Box className={styles.sidebarContent}>
            <Box paddingLeft={[0, 0, 0, 3]}>
              <FormStepper sections={sections} activeSection={activeSection} />
            </Box>

            <LogoHfj className={styles.logo} />
          </Box>
        </div>

        {/* <GridRow>
         */}
        {/* <GridColumn span={['12/12', '12/12', '9/12', '9/12']} >
            helo
          </GridColumn> */}

        {/* <GridColumn span={['12/12', '12/12', '9/12', '9/12']} className={styles.processGridColumn}>
            <Box
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.processContent}
            >
              {children}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '3/12', '3/12']}>

                  <Box className={styles.sidebarContent}>
              <Box paddingLeft={[0, 0, 0, 3]}>
               <FormStepper sections={sections} activeSection={activeSection} /> 
              </Box>
              

              <LogoHfj className={styles.logo}/>
            </Box>

         
            
          </GridColumn> */}
        {/* </GridRow> */}
      </GridContainer>
    </Box>
  ) : null
}

export default FormLayout

// const sections = [
//   {
//     name: 'Gagnaöflun',
//   },
//   {
//     name: 'Persónuhagir',
//     children: [
//       { type: 'SUB_SECTION', name: 'Heimili' },
//       { type: 'SUB_SECTION', name: 'Búseta' },
//       { type: 'SUB_SECTION', name: 'Nám' },
//       { type: 'SUB_SECTION', name: 'Staða' }
//     ],
//   },
//   {
//     name: 'Fjármál',
//     children: form?.hasIncome ?
//     [
//       { type: 'SUB_SECTION', name: 'Tekjur' },
//       { type: 'SUB_SECTION', name: 'Persónuafsláttur' },
//       { type: 'SUB_SECTION', name: 'Bankaupplýsingar' },
//     ]
//     :
//     [
//       { type: 'SUB_SECTION', name: 'Tekjur'},
//       { type: 'SUB_SECTION', name: 'Gögn'},
//       { type: 'SUB_SECTION', name: 'Persónuafsláttur'},
//       { type: 'SUB_SECTION', name: 'Bankaupplýsingar'},
//     ]
//   },
//   {
//     name: 'Samskipti',
//   },
//   {
//     name: 'Útreikningur',
//   },
//   {
//     name: 'Staðfesting',
//   },
// ]
