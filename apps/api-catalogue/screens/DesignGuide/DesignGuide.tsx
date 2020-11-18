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

import { useNamespace } from '../../hooks'
import { QueryGetNamespaceArgs } from '@island.is/api/schema'
import { GetNamespaceQuery } from '../../graphql/schema'
import { GET_NAMESPACE_QUERY } from '../Queries'
import { Screen } from '../../types'
import initApollo from '../../graphql/client'

import cn from 'classnames'
import * as styles from './DesignGuide.treat'

interface DesignGuideProps {
  staticContent: GetNamespaceQuery['getNamespace']
}

export const DesignGuide: Screen<DesignGuideProps> = ({ staticContent }) => {
  const n = useNamespace(staticContent)

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={2}>
            <Breadcrumbs>
              <a href="/">Viskuausan</a>
              <span>{n('title')}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Stack space={1}>
                <Text variant="h1">{n('title')}</Text>
                <Text variant="intro">{n('intro')}</Text>
              </Stack>
              <Stack space={3}>
                <Text variant="default">{n('body')}</Text>
                <Box className={cn(styles.buttonBox)}>
                  <Link href={n('viewButtonHref')}>
                    <Button iconType="outline" variant="primary" icon="open">
                      {n('viewButtonText')}
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

DesignGuide.getInitialProps = async (ctx) => {
  if (!ctx.locale) {
    ctx.locale = 'is-IS'
  }
  const client = initApollo({})

  const staticContent = await client
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'DesignGuide',
          lang: ctx.locale,
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields))

  return {
    staticContent,
  }
}
