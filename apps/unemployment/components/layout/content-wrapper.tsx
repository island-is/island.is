import React from 'react'
import {
  GridRow,
  GridColumn,
  GridContainer,
  Box
} from '@island.is/island-ui/core'
import Steps from './../steps/steps'
import { useRouter } from 'next/router'

const ContentWrapper: React.FC = ({ children }) => {
  const router = useRouter()
  return (
      <GridContainer>
        <GridRow>
          {router?.pathname !== "/" ? (
            <>
              <GridColumn span={['12/12', '12/12', '8/12', '8/12', '8/12']}>
                {children}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '4/12', '4/12', '4/12']}>
                <Box paddingLeft={8} paddingTop={2} paddingBottom={2} height="full"  background="blue100">
                  <Steps />
                </Box>
              </GridColumn>
            </>
          ) : (
              <GridColumn span={['12/12', '12/12', '12/12', '12/12', '12/12']}>
                {children}
              </GridColumn>
            )}
        </GridRow>
      </GridContainer>
  )
}


export default ContentWrapper