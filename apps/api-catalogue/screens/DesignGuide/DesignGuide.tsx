import React from 'react'
import { Layout } from '../../components'
import {
  Box,
  Breadcrumbs,
  Stack,
  Text,
  Button,
  Link,
} from '@island.is/island-ui/core'

import { Page } from '../../services/contentful.types'

import cn from 'classnames'
import * as styles from './DesignGuide.treat'

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
            <Stack space={3}>
              <Stack space={1}>
                <Text variant="h1">
                  {pageContent.strings.find((s) => s.id === 'dg-title').text}
                </Text>
                <Text variant="intro">
                  {pageContent.strings.find((s) => s.id === 'dg-intro').text}
                </Text>
              </Stack>
              <Stack space={3}>
                <Text variant="default">
                  {pageContent.strings.find((s) => s.id === 'dg-body').text}
                </Text>
                <Box className={cn(styles.buttonBox)}>
                  <Link
                    href={
                      pageContent.strings.find(
                        (s) => s.id === 'dg-view-button-href',
                      ).text
                    }
                  >
                    <Button iconType="outline" variant="primary" icon="open">
                      {
                        pageContent.strings.find(
                          (s) => s.id === 'dg-view-button',
                        ).text
                      }
                    </Button>
                  </Link>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
      }
    />
  )
}
