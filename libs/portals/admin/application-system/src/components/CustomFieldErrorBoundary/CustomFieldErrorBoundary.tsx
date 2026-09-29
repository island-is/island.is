import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  componentName: string
  resetKey?: string
  children: ReactNode
}

interface State {
  error: Error | null
  showDetails: boolean
}

export class CustomFieldErrorBoundary extends Component<Props, State> {
  override state: State = { error: null, showDetails: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, showDetails: false }
  }

  override componentDidUpdate(prevProps: Props) {
    if (
      this.state.error &&
      (prevProps.resetKey !== this.props.resetKey ||
        prevProps.componentName !== this.props.componentName)
    ) {
      this.setState({ error: null, showDetails: false })
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(
      `[CustomFieldErrorBoundary] "${this.props.componentName}" crashed:`,
      error,
      info.componentStack,
    )
  }

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }))
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
            Forskoðun · {this.props.componentName}
          </Text>
          <Text variant="small" color="dark300">
            Ekki tókst að forskoða þennan reit með sýnigögnum.
            <br />
            Þetta hefur ekki áhrif á textastrengina sjálfa, þeir eru áfram
            sýnilegir og breytanlegir hér til hægri.
          </Text>
          <Box
            display="inlineBlock"
            cursor="pointer"
            onClick={this.toggleDetails}
          >
            <Text variant="small" color="blue400">
              {this.state.showDetails
                ? 'Fela tæknilegar upplýsingar'
                : 'Sjá tæknilegar upplýsingar'}
            </Text>
          </Box>
          {this.state.showDetails && (
            <Text variant="small" color="dark300">
              {this.state.error.message}
            </Text>
          )}
        </Box>
      )
    }

    return this.props.children
  }
}
