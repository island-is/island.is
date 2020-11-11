import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as Sentry from '@sentry/react'

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
    if (window.location.origin === 'http://localhost:4200') {
      return
    }
    Sentry.captureException(error)
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
      <Text variant="h2">
        {formatMessage({
          id: 'service.portal:could-not-fetch',
          defaultMessage: 'Tókst ekki að sækja',
        })}{' '}
        {formatMessage(name)},
        {formatMessage({
          id: 'service.portal:something-went-wrong',
          defaultMessage: ' eitthvað fór úrskeiðis',
        })}
      </Text>
    </Box>
  )
}

export default WidgetError
