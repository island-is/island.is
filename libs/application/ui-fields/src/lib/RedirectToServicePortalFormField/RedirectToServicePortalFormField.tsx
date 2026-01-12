import React, { FC, useEffect } from 'react'

import {
  RedirectToServicePortalField,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, LoadingDots } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  field: RedirectToServicePortalField
}

export const RedirectToServicePortalFormField: FC<
  React.PropsWithChildren<Props>
> = ({ field, application }) => {
  useEffect(() => {
    const applicationId = application.id
    const path = window.location.origin
    const isLocalhost = path.includes('localhost')
    window.open(
      isLocalhost
        ? `http://localhost:4200/minarsidur/umsoknir#${applicationId}`
        : `${path}/minarsidur/umsoknir#${applicationId}`,
      '_self',
    )
  }, [application])
  const { marginTop = 10, marginBottom = 10 } = field

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="full"
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <LoadingDots size="large" />
    </Box>
  )
}
