import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { ReactIntlMessage } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

interface Props {
  name: string | ReactIntlMessage
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
  const { formatMessage } = useLocale()

  return (
    <Box padding={8}>
      <Typography variant="h2" as="h2">
        {formatMessage({
          id: 'service.portal:could-not-fetch',
          defaultMessage: 'Tókst ekki að sækja',
        })}
        {formatMessage(name)},
        {formatMessage({
          id: 'service.portal:something-went-wrong',
          defaultMessage: 'eitthvað fór úrskeiðis',
        })}
      </Typography>
    </Box>
  )
}

export default ModuleErrorScreen
