import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Input } from '@island.is/island-ui/core'
import { Country, ExternalDataNationalRegistry } from '../../types'
import { useFormContext } from 'react-hook-form'

const CountrySelectField: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const citizenship = (getValueViaPath(
    application.externalData,
    'nationalRegistry',
  ) as ExternalDataNationalRegistry)?.data?.citizenship

  const [countryData, setCountryData] = useState<string[]>([citizenship])
  const { register } = useFormContext()

  function getCountryInformation(countryName: string) {
    fetch(`https://restcountries.eu/rest/v2/name/${countryName}?fullText=true`)
      .then((res) => res.json())
      .then((data: Country[]) => {
        if (data.length) {
          setCountryData(
            data.map(({ name, alpha2Code: countryCode, regionalBlocs }) => {
              const regions = regionalBlocs.map((blocs) => blocs.acronym)
              return JSON.stringify({ name, countryCode, regions })
            }),
          )
        }
      })
  }

  useEffect(() => {
    getCountryInformation(citizenship)
  }, [citizenship])

  return (
    <Box>
      <Input
        id={id}
        name={id}
        value={countryData[0]}
        onChange={() => register}
        ref={register}
      />
    </Box>
  )
}

export default CountrySelectField
