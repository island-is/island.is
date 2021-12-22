import React from 'react'
import * as Sentry from '@sentry/node'
import { NextPageContext } from 'next'
import NextError, { ErrorProps as NextErrorProps } from 'next/error'

import { withLocale } from '../i18n'
import { NotFound } from '../screens'
import { Screen } from '../types'

type PropTypes = {
  err: Error
  isSSRReadyToRender: boolean
}

type ErrorProps = {
  isSSRReadyToRender: boolean
} & NextErrorProps

function CustomError({ isSSRReadyToRender, err }: PropTypes) {
  if (!isSSRReadyToRender && err) {
    Sentry.captureException(err)
  }

  return <NotFound />
}

CustomError.getInitialProps = async (
  ctx: NextPageContext,
): Promise<ErrorProps> => {
  const errorInitialProps = await NextError.getInitialProps(ctx)

  if (ctx.res) {
    if (ctx.res.statusCode === 404) {
      return { statusCode: 404, isSSRReadyToRender: true }
    }

    if (ctx.err) {
      Sentry.captureException(ctx.err)
      return { ...errorInitialProps, isSSRReadyToRender: true }
    }
  } else {
    if (ctx.err) {
      Sentry.captureException(ctx.err)
      return { ...errorInitialProps, isSSRReadyToRender: true }
    }
  }

  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${ctx.asPath}`),
  )
  return { ...errorInitialProps, isSSRReadyToRender: true }
}

export default withLocale(null, 'notFound')(CustomError as Screen)
