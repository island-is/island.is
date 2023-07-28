import React from 'react'
import { ErrorPage } from '@island.is/web/screens/Error'

export class ErrorBoundary extends React.Component {
  public state: { hasError: boolean }

  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <ErrorPage statusCode={500} />
    }
    return this.props.children
  }
}
