import { useRouteError } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import {
  NotFoundError,
  Problem,
  ProblemTypes,
} from '@island.is/react-spa/shared'

interface ModuleErrorScreenProps {
  name?: string | MessageDescriptor
  title?: string
  message?: string
  skipPadding?: boolean
}

export const ModuleErrorScreen = ({
  title,
  message,
  skipPadding,
}: ModuleErrorScreenProps) => {
  const error = useRouteError() as Error
  const notFoundError =
    (error as NotFoundError)?.code === ProblemTypes.notFound
      ? (error as NotFoundError)
      : undefined

  const renderProblem = () => (
    <Problem
      {...(notFoundError ? { type: ProblemTypes.notFound } : { error })}
      expand
      noBorder
      title={
        notFoundError && notFoundError?.title ? notFoundError.title : title
      }
      message={
        notFoundError && notFoundError?.description
          ? notFoundError.description
          : message
      }
    />
  )

  if (skipPadding) {
    return renderProblem()
  }

  return (
    <Box paddingY={6} paddingX={[0, 6]}>
      {renderProblem()}
    </Box>
  )
}
