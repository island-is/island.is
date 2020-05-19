// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import '@island.is/island-ui/core/reset'
import React from 'react'
import { ContentBlock, Box, Logo, Tiles } from '@island.is/island-ui/core'

export const Index = () => {
  return (
    <ContentBlock width="large">
      <Box background="blue200" padding={['smallGutter', 'containerGutter']}>
        <Tiles space={['smallGutter', 'gutter']} columns={[1, 2, 3, 4, 5]}>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Tiles>
      </Box>
    </ContentBlock>
  )
}

export default Index
