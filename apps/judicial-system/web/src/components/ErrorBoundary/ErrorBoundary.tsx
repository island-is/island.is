import { Component, type ErrorInfo, type PropsWithChildren } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Forwarded to Datadog by the browser-logs SDK
    console.error(
      `Unhandled render error: ${error.message}`,
      errorInfo.componentStack,
    )
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingY={10}
          paddingX={3}
        >
          <Box marginBottom={2}>
            <Text variant="h1">Eitthvað fór úrskeiðis</Text>
          </Box>
          <Box marginBottom={4}>
            <Text>
              Óvænt villa kom upp. Vinsamlegast endurhlaðið síðuna til að halda
              áfram.
            </Text>
          </Box>
          <Button onClick={() => window.location.reload()}>
            Endurhlaða síðu
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
