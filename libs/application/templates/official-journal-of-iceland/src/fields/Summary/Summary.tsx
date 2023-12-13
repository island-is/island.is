import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { f } = useFormatMessage(application)

  return (
    <Box>
      <FormIntro title={f(m.summarySectionTitle)} />
    </Box>
  )
}

export default Summary
