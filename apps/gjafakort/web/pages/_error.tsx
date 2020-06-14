import React from 'react'
import * as Sentry from '@sentry/node'
import { NextPageContext } from 'next'
import Error, { ErrorProps as NextErrorProps } from 'next/error'

import { withLocale } from '../i18n'
import { NotFound } from '../screens'
import { Screen } from '../types'

type PropTypes = {
  err: Error
  statusCode: number
  isSSRReadyToRender: boolean
  children?: React.ReactElement
}

type ErrorProps = {
  isSSRReadyToRender: boolean
} & NextErrorProps

const NextError = (props: PropTypes): JSX.Element => {
  const { statusCode, isSSRReadyToRender, err, children = null } = props

  if (!isSSRReadyToRender && err) {
    Sentry.captureException(err)
  }

  return <NotFound />
}

NextError.getInitialProps = async (
  props: NextPageContext,
): Promise<ErrorProps> => {
  const { res, err, asPath } = props
  // @ts-ignore
  const errorInitialProps: ErrorProps = await Error.getInitialProps({
    res,
    err,
  })
  errorInitialProps.isSSRReadyToRender = true

  if (res) {
    if (res.statusCode === 404) {
      return { statusCode: 404, isSSRReadyToRender: true }
    }

    if (err) {
      Sentry.captureException(err)
      return errorInitialProps
    }
  } else {
    if (err) {
      Sentry.captureException(err)
      return errorInitialProps
    }
  }

  Sentry.captureException(
    // @ts-ignore
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
  )

  return errorInitialProps
}

export default withLocale('is')(NextError)
