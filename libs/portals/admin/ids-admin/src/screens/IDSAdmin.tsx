import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Stack } from '@island.is/island-ui/core'
import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

const IDSAdmin = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [backValue, setBackValue] = useState('')
  return (
    <Stack space={'containerGutter'}>
      <Button
        colorScheme="default"
        iconType="filled"
        onClick={() => {
          navigate(backValue)
        }}
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
      >
        {formatMessage(m.back)}
      </Button>

      <Outlet context={{ setBackValue }} />
    </Stack>
  )
}

export default IDSAdmin
