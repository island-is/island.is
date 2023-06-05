import React, { useEffect, useState } from 'react'
import { fetchCountries } from '../../utils/getCountries'
import { SelectFormField } from '@island.is/application/ui-fields'
import { FieldComponents, FieldTypes } from '@island.is/application/types'

export const CountrySelect = ({ field, application, error }: any) => {
  const [loading, setLoading] = useState(true)
  const countryOptions = fetchCountries()

  useEffect(() => {
    console.log('countryOptions', countryOptions)
    if (countryOptions.length > 0) {
      console.log('setting loading to false')
      setLoading(false)
    }
  }, [countryOptions])

  return !loading ? (
    <SelectFormField
      application={application}
      field={{
        id: field.id,
        title: 'countrySelect',
        options: countryOptions,
        component: FieldComponents.SELECT,
        children: undefined,
        type: FieldTypes.SELECT,
      }}
    ></SelectFormField>
  ) : (
    <p>Loading...</p>
  )
}
