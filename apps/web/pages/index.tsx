import React from 'react'
<<<<<<< Updated upstream
import { Logo } from '@island.is/island-ui/core'

import './index.scss'
=======
import {
  ContentBlock,
  Box,
  Logo,
  Tiles,
  Column,
  Columns,
} from '@island.is/island-ui/core'
>>>>>>> Stashed changes

export const Index = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./${fileName}.${style} file.
   */
  return (
<<<<<<< Updated upstream
    <div className="app">
      <header className="flex">
        <h1>
          Welcome to <Logo solid width={140} />
        </h1>
      </header>
    </div>
=======
    <ContentBlock width="large">
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
>>>>>>> Stashed changes
  )
}

export default Index
