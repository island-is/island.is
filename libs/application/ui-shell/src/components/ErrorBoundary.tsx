import React, { PureComponent, ReactNode } from 'react'
import * as Sentry from '@sentry/browser'
import { Application, coreMessages } from '@island.is/application/core'
import { FormScreen } from '@island.is/application/ui-shell'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  application: Application
  children: ReactNode
  currentScreen: FormScreen
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

const ErrorMessage = () => {
  const { formatMessage } = useLocale()

  return (
    <AlertMessage
      type="error"
      title={formatMessage(coreMessages.globalErrorTitle)}
      message={formatMessage(coreMessages.globalErrorMessage)}
    />
  )
}

class ErrorBoundary extends PureComponent<Props, StateTypes> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: undefined,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error) {
    const { application, currentScreen } = this.props

    Sentry.withScope((scope) => {
      scope.setExtra('applicationType', application.typeId)
      scope.setExtra('applicationState', application.state)
      scope.setExtra('currentScreen', currentScreen.id)
      Sentry.captureException(error)
    })
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state

    if (this.state.hasError) {
      return <ErrorMessage />
    }

    return children
  }
}

export default ErrorBoundary
