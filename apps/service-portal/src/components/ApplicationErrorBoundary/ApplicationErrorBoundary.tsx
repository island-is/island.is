import React, { PureComponent, FC } from 'react'
import * as Sentry from '@sentry/react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface PropTypes {
  children: React.ReactNode
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

export class ApplicationErrorBoundary extends PureComponent<
  PropTypes,
  StateTypes
> {
  constructor(props: PropTypes) {
    super(props)
    this.state = { error: undefined, hasError: false }
  }

  public static getDerivedStateFromError(_: Error): StateTypes {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (window.location.origin === 'http://localhost:4200') {
      return
    }
    Sentry.captureException(error)
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state

    if (hasError) {
      return <Error />
    }
    return children
  }
}

const Error: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="h2">
        {formatMessage({
          id: 'sp:error-page-heading',
          defaultMessage: 'Eitthvað fór úrskeiðis',
        })}
      </Text>
    </Box>
  )
}

export default ApplicationErrorBoundary
