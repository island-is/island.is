/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { ErrorProps } from 'next/error'
import Link from 'next/link'
import Head from 'next/head'
import { Box, Typography, Stack, Breadcrumbs } from '@island.is/island-ui/core'

import { ArticleLayout } from '@island.is/adgerdir/screens/Layouts/Layouts'

function CustomError({ statusCode, title = '', ...props }: ErrorProps) {
  return (
    <>
      <Head>
        <title>{statusCode} | Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout>
        <Stack space={2}>
          <Breadcrumbs color="blue400">
            <Link as="/" href="/">
              <a>Viðspyrna</a>
            </Link>
            <span>{statusCode}</span>
          </Breadcrumbs>
          <Box>
            <Typography variant="h1" as="h1">
              {statusCode === 404
                ? title || 'Síða fannst ekki!'
                : title || 'Villa kom upp!'}
            </Typography>
          </Box>
        </Stack>
      </ArticleLayout>
    </>
  )
}

CustomError.getInitialProps = ({ ...props }) => {
  const statusCode = props?.err?.statusCode ?? props?.res?.statusCode ?? 404
  const title = props?.err?.title ?? ''
  return { statusCode, title }
}

export default CustomError
