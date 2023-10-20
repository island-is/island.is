import React, { ErrorInfo, PureComponent } from 'react'

import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'

import * as styles from './ApplicationErrorBoundry.css'

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

  public static getDerivedStateFromError(error: Error): StateTypes {
    return {
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  override render() {
    const { children } = this.props
    const { error } = this.state

    if (error) {
      return (
        <Box padding={[0, 6]} className={styles.expandHeight}>
          <Problem error={error} expand logError={false} />
        </Box>
      )
    }

    return children
  }
}
