import React, { ReactNode, FC } from 'react'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Footer,
} from '@island.is/island-ui/core'
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'

interface PageProps {
  children: ReactNode
}

export const PageLayout: FC<PageProps> = ({ children }) => (
  <>
    <Box paddingY={10}>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '7/12', '7/12']}
            offset={['0', '0', '1/12', '1/12']}
          >
            <Box>{children}</Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '3/12', '3/12']}
            offset={['0', '0', '1/12', '1/12']}
          ></GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
    <Footer />
  </>
)

export const ProcessPageLayout: FC<PageProps> = ({ children }) => (
  <Box paddingY={10} background="purple100">
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
          <OutlinedBox paddingY={6} backgroundColor="white" borderColor="white">
            <GridRow>
              <GridColumn
                span={['7/9', '7/9', '7/9', '7/9']}
                offset={['1/9', '1/9', '1/9', '1/9']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </OutlinedBox>
        </GridColumn>
        <GridColumn
          span={['0', '0', '3/12', '3/12']}
          offset={['0', '0', '1/12', '1/12']}
        ></GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
