import React, { FC, useEffect, useState } from 'react'
import { formatText } from '@island.is/application/core'
import { Option, Stack } from '@island.is/island-ui/core'
import {
  FieldDescription,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'
import { ReviewFieldProps, Country } from '../../types'

interface Props extends ReviewFieldProps {
  isReviewField?: boolean
}

const CountrySelectField: FC<Props> = ({
  field,
  application,
  isReviewField,
  error,
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
            data.map(({ name, alpha2Code: countryCode, regionalBlocs }) => {
              const regions = regionalBlocs.map((blocs) => blocs.acronym)
              const option = { name, countryCode, regions }
              return {
                label: name,
                value: JSON.stringify(option),
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
    <Stack space={2}>
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
        placeholder={formatText(
          m.formerInsuranceCountryPlaceholder,
          application,
          formatMessage,
        )}
        options={options}
        disabled={isReviewField}
        backgroundColor="blue"
        error={error}
      />
    </Stack>
  )
}

export default CountrySelectField
