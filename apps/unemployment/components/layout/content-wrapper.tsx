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
    <div style={{ height: '80vh' }}>
      <GridContainer>
        <GridRow>
          {router?.pathname !== "/" ? (
            <>
              <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
                {children}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']} >
                <Box marginLeft={10} marginTop={2}>
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
    </div>
  )
}


export default ContentWrapper