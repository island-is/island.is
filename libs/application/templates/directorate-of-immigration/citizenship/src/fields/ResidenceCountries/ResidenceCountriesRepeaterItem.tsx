import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, FieldComponents, FieldTypes, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  LinkV2,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import { SelectFormField } from '@island.is/application/ui-fields'
import { fetchCountries } from '../../utils/getCountries'
import { CountryOfResidence } from '../../shared/types'

interface Props {
  id: string
  index: number
  repeaterField: GenericFormField<CountryOfResidence>
  handleRemove: (index: number) => void
  itemNumber: number
  addCountryToList: (country: string, index: number) => void
}

export const ResidenceCountriesRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  itemNumber,
  addCountryToList,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const countryField = `${fieldIndex}.country`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  const countryOptions = fetchCountries()

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue])

  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      {index > 0 && (
        <Box 
          display='flex'
          flexDirection='row'
          justifyContent='flexEnd'
        >
          <Button 
            variant='text'
            textSize='sm'
            size='small'
            onClick={() => handleRemove(index)}
          >
            Eyða færslu
            </Button>
        </Box>
      )}
      <SelectFormField
        application={application}
        field={{
          id: countryField,
          title: `Búsetuland ${itemNumber+1}`,
          options: countryOptions,
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          onSelect: (value) => addCountryToList(value.value as string, index)
        }}
        ></SelectFormField>
    </Box>
  )
}
