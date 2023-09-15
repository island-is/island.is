import React, { FC, useEffect, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

export const ViewOverviewInDone: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [showOverview, setShowOverview] = useState(false)

  useEffect(() => {
    showOverview
      ? setValue('viewOverview', true)
      : setValue('viewOverview', false)
  }, [showOverview, setValue])

  return (
    <Box position={'absolute'} right={0} style={{ top: '-150px' }}>
      <Button
        variant="utility"
        size="small"
        onClick={() => setShowOverview(!showOverview)}
      >
        {showOverview
          ? formatMessage(m.viewNextStepsButton)
          : formatMessage(m.viewOverviewButton)}
      </Button>
    </Box>
  )
}
