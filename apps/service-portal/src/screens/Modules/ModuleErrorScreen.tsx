import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

interface Props {
  name: string
}

export class ModuleErrorBoundary extends React.Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // TODO: Log error
  }

  render() {
    if (this.state.hasError) return <ModuleErrorScreen name={this.props.name} />
    return this.props.children
  }
}

const ModuleErrorScreen: FC<Props> = ({ name }) => {
  return (
    <Box padding={8}>
      <Typography variant="h2" as="h2">
        Tókst ekki að sækja {name}, eitthvað fór úrskeiðis
      </Typography>
    </Box>
  )
}

export default ModuleErrorScreen
