import React, { FC, useCallback, useEffect, useState } from 'react'

import AOD from '../../assets/AOD'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { Field, useFormContext } from 'react-hook-form'
import { formatMessage } from '@formatjs/intl'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'

export const Done: FC<FieldBaseProps> = (props) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [showOverview, setShowOverview] = useState(false)

  useEffect(() => {
    showOverview ? setValue('viewOverview', true) : setValue('viewOverview', false)
  }, [showOverview, setValue])

  return (
    <>
      <Box position={'absolute'} right={0} style={{top: '-150px'}}>
        <Button size='small' onClick={() => setShowOverview(!showOverview)}>{showOverview ? 'Sjá næstu skréf' : 'Sjá yfirlit'}</Button>
      </Box>
      
      <Box marginTop={6} marginBottom={6} display="flex" justifyContent="center">
        <AOD />
      </Box>
    </>
  )
}
