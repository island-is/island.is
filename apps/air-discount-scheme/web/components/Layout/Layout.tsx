import React, { ReactNode } from 'react'
import {
  GridRow,
  GridColumn,
  GridContainer,
  Box,
  Stack,
} from '@island.is/island-ui/core'
import { ReactComponent as LoftbruLogo } from '../../assets/loftbru.svg'
import { ReactComponent as SRNLogo } from '../../assets/SRN.svg'
import { ReactComponent as VEGLogo } from '../../assets/VEG.svg'

interface PropTypes {
  main: ReactNode
  aside?: ReactNode
}

function Layout({ main, aside }: PropTypes) {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
          {main}
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
          {aside}
          <Stack space={3}>
            <a
              href="https://loftbru.is"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Box
                textAlign="center"
                padding={3}
                borderStyle="solid"
                borderWidth="standard"
                borderRadius="standard"
                borderColor="dark100"
              >
                <LoftbruLogo title="Loftbrú" />
              </Box>
            </a>
            <Box
              textAlign="center"
              padding={3}
              borderStyle="solid"
              borderWidth="standard"
              borderRadius="standard"
              borderColor="dark100"
            >
              <SRNLogo title="Samgöngu- og sveitarstjórnarráðuneyti" />
            </Box>
            <Box
              textAlign="center"
              padding={3}
              borderStyle="solid"
              borderWidth="standard"
              borderRadius="standard"
              borderColor="dark100"
            >
              <VEGLogo title="Vegagerðin" />
            </Box>
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Layout
