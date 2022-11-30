import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'

interface ModuleErrorScreenProps {
  name: string | MessageDescriptor
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

export class ModuleErrorBoundary extends React.Component<
  ModuleErrorScreenProps,
  { hasError: boolean }
> {
  constructor(props: ModuleErrorScreenProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): StateTypes {
    return { hasError: true, error: undefined }
  }

  componentDidCatch(error: Error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) return <ModuleErrorScreen name={this.props.name} />
    return this.props.children
  }
}

export const ModuleErrorScreen = ({ name }: ModuleErrorScreenProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box padding={8}>
      <Text variant="h2" as="h2">
        {formatMessage(m.couldNotFetch)} {formatMessage(name)},
        {formatMessage(m.somethingWrong)}
      </Text>
    </Box>
  )
}
