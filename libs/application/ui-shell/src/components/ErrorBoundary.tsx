import React, { PureComponent, ReactNode } from 'react'
import * as Sentry from '@sentry/browser'
import { Application } from '@island.is/application/core'
import { FormScreen } from '@island.is/application/ui-shell'
import { AlertMessage } from '@island.is/island-ui/core'

interface Props {
  application: Application
  children: ReactNode
  currentScreen: FormScreen
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}
class ErrorBoundary extends PureComponent<Props, StateTypes> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: undefined }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    const { application, currentScreen } = this.props
    if (!window.location.origin.includes('http://localhost')) {
      Sentry.withScope((scope) => {
        scope.setExtra('applicationType', application.typeId)
        scope.setExtra('applicationState', application.state)
        scope.setExtra('currentScreen', currentScreen.id)
        Sentry.captureException(error)
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <AlertMessage
          type="error"
          title="Something went wrong"
          message="Sorry! something went terribly wrong and we are looking into it"
        />
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
