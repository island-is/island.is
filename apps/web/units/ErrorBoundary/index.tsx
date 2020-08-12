import React from 'react'
import { ErrorProps } from 'next/error'
import ErrorPage from '../../pages/_error'

export const withErrorBoundary = (Component) => {
  class ErrorBoundary extends React.Component<ErrorProps> {
    state = {statusCode: 0, title: ''}
    static getDerivedStateFromError(error: Error) {
      // All throws from frontend are critical crashes,
      // return generic error code unless the error is a custom error object
      return { statusCode: 500, ...error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      // TODO: Add central logging here
      // TODO: Restrict console logging to development
      console.error(error, info)
    }

    render() {
      const { statusCode: propsStatusCode, title: propsTitle, children } = this.props
      const {statusCode: stateStatusCode, title: stateTitle} = this.state
      const statusCode = propsStatusCode || stateStatusCode
      const title = propsTitle || stateTitle

      if (statusCode) {
        // Display error page for all client side errors during render
        return <ErrorPage statusCode={statusCode} title={title} />
      } else {
        return children
      }
    }
  }

  const NewComponent = (props) => (
    <ErrorBoundary {...props.error}>
      <Component {...props} />
    </ErrorBoundary>
  )

  // Wrapped component might not have getInitialProps dont define for (Automatic Static Optimization)
  if (Component.getInitialProps) {
    // Wrap getInitialProps to be able to pass custom error codes to error page
    NewComponent.getInitialProps = async (ctx) => {
      try {
        return await Component.getInitialProps(ctx)
      } catch ({ statusCode = 500, title, ...error }) {
        // TODO: Add central logging here
        // TODO: Restrict console logging to development
        console.error(error)
        // Let ErrorBoundary handle error display for getInitialProps
        return { error: { statusCode, title } }
      }
    }
  }

  return NewComponent
}

export class CustomNextError extends Error {
  statusCode
  title
  constructor(statusCode: number, title?: string, message?: string) {
    super(message ?? title)
    this.statusCode = statusCode
    this.title = title
  }
}
