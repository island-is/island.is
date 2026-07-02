import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  componentName: string
  children: ReactNode
}

interface State {
  error: Error | null
}

export class CustomFieldErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(
      `[CustomFieldErrorBoundary] "${this.props.componentName}" crashed:`,
      error,
      info.componentStack,
    )
  }

  override render() {
    if (this.state.error) {
      return (
        <Box
          padding={2}
          border="standard"
          borderRadius="standard"
          background="red100"
        >
          <Text variant="eyebrow" color="red600">
            Preview · {this.props.componentName}
          </Text>
          <Text variant="small" color="dark300">
            {this.state.error.message}
          </Text>
        </Box>
      )
    }

    return this.props.children
  }
}
