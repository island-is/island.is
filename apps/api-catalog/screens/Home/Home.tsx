import React from 'react'
import { Card } from '../../components'
import {
  Box,
  Stack,
  Typography,
  Columns,
} from '@island.is/island-ui/core'

function Home({ pageContent }) {

  return (
      <Box marginBottom={[3, 3, 3, 12]} marginTop={1} textAlign="center">
        <Stack space={5}>
          <Stack space={3}>
            <Typography variant="h1">
              {pageContent.title}
            </Typography>
          </Stack>
          <Stack space={3}>
            <Typography variant="intro">
              {pageContent.introText}
            </Typography>
          </Stack>
          <Box marginTop="gutter">
            <Columns align="center">
              {
                pageContent.buttons.map((button, index) => {
                  return <Card key={index} title={button.label} slug={button.linkUrl} />
                }) 
              }
            </Columns>
          </Box>
        </Stack>
      </Box>
  )
}

export default Home
