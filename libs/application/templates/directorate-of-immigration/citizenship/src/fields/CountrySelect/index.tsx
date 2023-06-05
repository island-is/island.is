import React, { useEffect, useState } from 'react'
import { fetchCountries } from '../../utils/getCountries'
import { SelectFormField } from '@island.is/application/ui-fields'
import { FieldComponents, FieldTypes } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'


export const CountrySelect = ({ field, application, error }: any) => {
  const [loading, setLoading] = useState(true)
  const [selectedCountries, setSelectedCountries] = useState<Array<any>>([])

  const countryOptions = fetchCountries()

  useEffect(() => {
    console.log('countryOptions', countryOptions)
    if (countryOptions.length > 0) {
      console.log('setting loading to false')
      // setLoading(false)
    }
  }, [countryOptions])

  const handleAdd = (type: 'operator' | 'coOwner') =>
  setSelectedCountries([
      ...selectedCountries,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
        type,
      },
    ])

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
    <Box
      width='full'
    >
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        size='large'
        onClick={handleAdd.bind(null, 'operator')}
        fullWidth
        textSize='md'
      >
        Bæta við fleiri löndum
      </Button>
    </Box>
  )
}
