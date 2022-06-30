import React, { FC, useEffect } from 'react'

import {
  RedirectToServicePortalField,
  FieldBaseProps,
} from '@island.is/application/core'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'

interface Props extends FieldBaseProps {
  field: RedirectToServicePortalField
}

export const RedirectToServicePortalFormField: FC<Props> = ({
  application,
}) => {
  const history = useHistory()

  useEffect(() => {
    const applicationId = application.id

    process.env.NODE_ENV === 'development'
      ? window.open(
          `http://localhost:4200/minarsidur/umsoknir#${applicationId}`,
          '_self',
        )
      : history.push(`/minarsidur/umsoknir#${applicationId}`)
  }, [history, application])

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="full"
      marginTop={10}
      marginBottom={10}
    >
      <LoadingDots large />
    </Box>
  )
}
