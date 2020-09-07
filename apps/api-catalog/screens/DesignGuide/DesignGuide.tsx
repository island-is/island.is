import React from 'react'
import Head from 'next/head'
import { Layout } from '../../components'
import {
  Box,
  Breadcrumbs, 
  Stack, 
  Typography, 
  Button,
  Link
} from '@island.is/island-ui/core'


function DesignGuide() {
  return (
    <Layout left={
      <Box>
        <Box marginBottom={4}>
          <Breadcrumbs>
              <a href="/">
                Ísland.is
              </a>
              <span>API Design Guide</span>
          </Breadcrumbs>
        </Box>
        <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
          <Stack space={5}>
            <Stack space={3}>
              <Typography variant="h1">
                API Design Guide
              </Typography>
            </Stack>
            <Stack space={3}>
              <Typography variant="intro">
                This is the home of the API Design Guide published by Stafrænt Ísland
                as a best practice guide for API development.
              </Typography>
              <Typography variant="p">
                This guide should help synchronize the work between developers and
                make working together easier. It covers the relevant design principles 
                and patterns to use so the consumer experience is enjoyable and
                consistent throughout APIs.
                <br/><br/>
                The guide is under constant review and updates will be made over time
                as new design patterns and styles are adopted.
                <br/>
                All feedback is welcomed and encouraged to help make the guide better
                so please feel free to create pull requests. 
              </Typography>
            </Stack>
            <Stack space={3}>
              <Link href="https://github.com/island-is/handbook/tree/feature/add-api-design-guide-structure/docs/api-design-guide">
                <Button variant="normal" icon="external">
                  View the API Design Guide on GitHub
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>
    } />
  )
}

export default DesignGuide