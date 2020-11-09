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

export class ModuleErrorBoundary extends React.Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(_: Error): StateTypes {
    return { hasError: true, error: undefined }
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error)
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
      <Text variant="h2">
        {formatMessage({
          id: 'service.portal:could-not-fetch',
          defaultMessage: 'Tókst ekki að sækja',
        })}{' '}
        {formatMessage(name)},
        {formatMessage({
          id: 'service.portal:something-went-wrong',
          defaultMessage: 'eitthvað fór úrskeiðis',
        })}
      </Text>
    </Box>
  )
}

export default ModuleErrorScreen
