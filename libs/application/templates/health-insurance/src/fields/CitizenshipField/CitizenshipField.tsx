import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Input } from '@island.is/island-ui/core'
import { Citizenship } from '@island.is/api/schema'
import { ExternalDataNationalRegistry } from '../../types'

const CitizenshipField: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const citizenship = (getValueViaPath(
    application.externalData,
    'nationalRegistry',
  ) as ExternalDataNationalRegistry)?.data?.citizenship as Citizenship

  const [countryData, setCountryData] = useState<string>(
    JSON.stringify(citizenship),
  )
  const { register } = useFormContext()

  useEffect(() => {
    setCountryData(JSON.stringify({ ...citizenship }))
  }, [citizenship])

  return (
    <Box hidden>
      <Input
        id={id}
        name={id}
        value={countryData}
        onChange={() => register}
        ref={register}
      />
    </Box>
  )
}

export default CitizenshipField
