import React, { FC, useEffect, useState } from 'react'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import {
  AsyncSearchOption,
  Option,
  Box,
  Select,
} from '@island.is/island-ui/core'
import {
  FieldDescription,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from 'libs/localization/src'
import { m } from '../../forms/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { HiddenDateField } from '..'

interface Props extends FieldBaseProps {
  field: CustomField
}
// TODO handle regionalBlocs
type Country = {
  name: string
  alpha2Code: string
  region: string
  regionalBlocs: object[]
}

const CountrySelectField: FC<Props> = ({ field, application }) => {
  const { id } = field
  const [options, setOptions] = useState<Option[]>([])

  const { formatMessage } = useLocale()

  //TODO handle pending
  // Move this?
  function fetchCountries() {
    fetch(`https://restcountries.eu/rest/v2/all`)
      .then((res) => res.json())
      .then((data: Country[]) => {
        if (data.length) {
          setOptions(
            data.map(({ name }) => {
              return {
                label: name,
                value: name,
              }
            }),
          )
        }
      })
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  return (
    <Box>
      <FieldDescription
        description={formatText(
          m.formerInsuranceDetails,
          application,
          formatMessage,
        )}
      />
      <SelectController
        id={id}
        name={id}
        label={formatText(m.formerInsuranceCountry, application, formatMessage)}
        placeholder="Select the country that you are moving from"
        options={options}
      />
    </Box>
  )
}

export default CountrySelectField
