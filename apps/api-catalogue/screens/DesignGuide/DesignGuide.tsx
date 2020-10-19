import React from 'react'
import { Layout } from '../../components'
import {
  Box,
  Breadcrumbs,
  Stack,
  Typography,
  Button,
  Link,
} from '@island.is/island-ui/core'

import { Page } from '../../services/contentful.types'

export interface DesignGuideProps {
  pageContent: Page
}

export function DesignGuide({ pageContent }: DesignGuideProps) {
  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={2}>
            <Breadcrumbs>
              <a href="/">Viskuausan</a>
              <span>
                {pageContent.strings.find((s) => s.id === 'dg-title').text}
              </span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={5}>
              <Stack space={3}>
                <Typography variant="h1">
                  {pageContent.strings.find((s) => s.id === 'dg-title').text}
                </Typography>
              </Stack>
              <Stack space={3}>
                <Typography variant="intro">
                  {pageContent.strings.find((s) => s.id === 'dg-intro').text}
                </Typography>
                <Typography variant="p">
                  {pageContent.strings.find((s) => s.id === 'dg-body').text}
                </Typography>
              </Stack>
              <Stack space={3}>
                <Link
                  href={
                    pageContent.strings.find(
                      (s) => s.id === 'dg-view-button-href',
                    ).text
                  }
                >
                  <Button variant="primary" icon="external">
                    {
                      pageContent.strings.find((s) => s.id === 'dg-view-button')
                        .text
                    }
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Box>
      }
    />
  )
}
