// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import '@island.is/island-ui/core/reset'
import React from 'react'
import {
  ContentBlock,
  Box,
  Logo,
  Tiles,
  Column,
  Inline,
  Columns,
  Stack,
} from '@island.is/island-ui/core'

export const Index = () => {
  return (
    <>
      <Stack align={['center', 'left']} space={['small', 'large']}>
        <Box background="blueberry100" padding="small">
          <div>
            <h3>Stuff here</h3>
            <Logo width={140} />
          </div>
        </Box>
        <Box background="blueberry100" padding="small">
          <div>
            <h3>Stuff here</h3>
            <Logo width={140} />
          </div>
        </Box>
        <Box background="blueberry100" padding="small">
          <div>
            <h3>Stuff here</h3>
            <Logo width={140} />
          </div>
        </Box>
        <Box background="blueberry100" padding="small">
          <div>
            <h3>Stuff here</h3>
            <Logo width={140} />
          </div>
        </Box>
      </Stack>
      <Box padding="large">
        <Inline space={['small', 'medium', 'large', 'xlarge', 'xxlarge']}>
          <Box background="blueberry100" padding="small">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="blueberry100" padding="small">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="blueberry100" padding="small">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="blueberry100" padding="small">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="blueberry100" padding="small">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Inline>
      </Box>
      <Columns collapseBelow="md" space="small">
        <Column>
          <Box background="white" boxShadow="small" padding="large">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Column>
        <Column>
          <Box background="white" boxShadow="small" padding="large">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Column>
      </Columns>
      <Columns space={['small', 'medium', 'large']}>
        <Column>
          <Box background="white" boxShadow="small" padding="large">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Column>
        <Column>
          <Box background="white" boxShadow="small" padding="large">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Column>
        <Column>
          <Box background="white" boxShadow="small" padding="large">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Column>
      </Columns>
      <ContentBlock width="large">
        <Box background="blue400" padding="large">
          <Tiles space="large" columns={[1, 2, 3, 4, 5]}>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
            <Box background="mint100" boxShadow="small" padding="large">
              <div>
                <h3>Stuff here</h3>
                <Logo width={140} />
              </div>
            </Box>
          </Tiles>
        </Box>
      </ContentBlock>
    </>
  )
}

export default Index
