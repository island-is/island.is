import { Component, type ErrorInfo, type PropsWithChildren } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

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
        <Box paddingY={10} paddingX={3}>
          <div className={grid({ gap: 2, marginBottom: 4 })}>
            <Text variant="h1" textAlign="center">
              Eitthvað fór úrskeiðis
            </Text>
            <Text textAlign="center">
              Óvænt villa kom upp. Vinsamlegast endurhlaðið síðuna til að halda
              áfram.
            </Text>
          </div>
          <Box display="flex" justifyContent="center">
            <Button onClick={() => window.location.reload()}>
              Endurhlaða síðu
            </Button>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
