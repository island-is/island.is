import React, { ReactNode, FC } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Footer,
} from '@island.is/island-ui/core'

interface PageProps {
  children: ReactNode
  right?: ReactNode
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

export const ProcessPageLayout: FC<PageProps> = ({ children, right }) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <Box
      paddingY={[0, 0, 10, 10]}
      background={isMobile ? 'white' : 'purple100'}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
            <Box
              paddingY={6}
              background="white"
              borderColor="white"
              borderRadius="large"
            >
              <GridColumn
                span={['9/9', '9/9', '7/9', '7/9']}
                offset={['0', '0', '1/9', '1/9']}
              >
                {children}
              </GridColumn>
            </Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '0', '3/12']}
            offset={['0', '0', '0', '1/12']}
          >
            {right}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
