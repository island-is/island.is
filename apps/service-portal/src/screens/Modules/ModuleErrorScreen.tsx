import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'

interface Props {
  name: string | MessageDescriptor
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

export class ModuleErrorBoundary extends React.Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
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

const ModuleErrorScreen: FC<Props> = ({ name }) => {
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

export default ModuleErrorScreen
