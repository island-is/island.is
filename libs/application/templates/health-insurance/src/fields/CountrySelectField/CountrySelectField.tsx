import React, { FC, useEffect, useState } from 'react'
import { formatText } from '@island.is/application/core'
import { Option, Box } from '@island.is/island-ui/core'
import {
  FieldDescription,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from 'libs/localization/src'
import { m } from '../../forms/messages'
import { ReviewFieldProps } from '../../types'

type Country = {
  name: string
  alpha2Code: string
  region: string
  regionalBlocs: Blocs[]
}

type Blocs = {
  acronym: string
}

interface Props extends ReviewFieldProps {
  isReviewField?: boolean
}

const CountrySelectField: FC<Props> = ({
  field,
  application,
  isReviewField,
}) => {
  const { id } = field
  const [options, setOptions] = useState<Option[]>([])
  const { formatMessage } = useLocale()

  function getCountryOptions() {
    fetch(`https://restcountries.eu/rest/v2/all`)
      .then((res) => res.json())
      .then((data: Country[]) => {
        if (data.length) {
          setOptions(
            data.map(({ name, alpha2Code, regionalBlocs }) => {
              const regions = regionalBlocs.map((blocs) => `"${blocs.acronym}"`)
              return {
                label: name,
                value: `{"name": "${name}", "countryCode": "${alpha2Code}", "regions": [${regions}]}`,
              }
            }),
          )
        }
      })
  }

  useEffect(() => {
    getCountryOptions()
  }, [])

  return (
    <Box>
      {!isReviewField && (
        <FieldDescription
          description={formatText(
            m.formerInsuranceDetails,
            application,
            formatMessage,
          )}
        />
      )}
      <SelectController
        id={id}
        name={id}
        label={formatText(m.formerInsuranceCountry, application, formatMessage)}
        placeholder="Select the country that you are moving from"
        options={options}
        disabled={isReviewField}
      />
    </Box>
  )
}

export default CountrySelectField
