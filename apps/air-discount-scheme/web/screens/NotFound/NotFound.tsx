import React from 'react'
import Router from 'next/router'

import {
  Box,
  Button,
  ContentBlock,
  Columns,
  Column,
  Icon,
  Typography,
} from '@island.is/island-ui/core'

function NotFound() {
  return (
    <ContentBlock width="large">
      <Box paddingX="gutter">
        <Box marginBottom={4}>
          <Columns>
            <Box
              background="blue100"
              padding={[2, 2, 3]}
              border="standard"
              borderRadius="large"
            >
              <Columns>
                <Column width="content">
                  <Box marginRight={2} alignItems="center" display="flex">
                    <Icon type="info" />
                  </Box>
                </Column>
                <Column>
                  <Box marginBottom={1}>
                    <Typography variant="h4">
                      Umbeðin slóð fannst ekki
                    </Typography>
                  </Box>
                  <Typography variant="p">
                    Eitthvað hefur farið úrskeiðis, vinsamlegast reynið aftur
                  </Typography>
                </Column>
              </Columns>
            </Box>
          </Columns>
        </Box>
        <Button variant="text" onClick={() => Router.back()}>
          <Box marginRight={1} alignItems="center" display="flex">
            <Icon type="arrowLeft" width={16} />
          </Box>
          Til baka
        </Button>
      </Box>
    </ContentBlock>
  )
}

export default NotFound
