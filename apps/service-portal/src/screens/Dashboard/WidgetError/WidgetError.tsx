import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { m } from '@island.is/service-portal/core'

interface Props {
  name: string | MessageDescriptor
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

export class WidgetErrorBoundary extends React.Component<Props, StateTypes> {
  constructor(props: Props) {
    super(props)
    this.state = { error: undefined, hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) return <WidgetError name={this.props.name} />
    return this.props.children
  }
}

const WidgetError: FC<Props> = ({ name }) => {
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

export default WidgetError
