import React, { FC } from 'react'

import {
  ToastContainer,
  Box,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'

import Header from '../Header/Header'
import * as styles from './Layout.css'

const Layout: FC = ({ children }) => {
  useNamespaces(['admin.portal', 'global'])

  return (
    <>
      <ToastContainer useKeyframeStyles={false} />
      <Header />
      <Box
        className={styles.container}
        background={['white', 'white', 'white', 'blue100']}
        paddingY={[0, 0, 0, 5]}
      >
        <GridContainer>
          <Box
            className={styles.contentBox}
            height="full"
            borderRadius="large"
            background="white"
            paddingY={[3, 3, 3, 10]}
          >
            <GridRow>
              <GridColumn
                offset={['0', '0', '0', '2/12']}
                span={['12/12', '12/12', '12/12', '8/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Box>
    </>
  )
}
export default Layout
