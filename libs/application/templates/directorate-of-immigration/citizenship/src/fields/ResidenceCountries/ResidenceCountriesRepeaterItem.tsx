import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  GenericFormField,
} from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { SelectFormField } from '@island.is/application/ui-fields'
import { CountryOfResidence } from '../../shared'
import { information } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { Country } from '@island.is/clients/directorate-of-immigration'
import { getErrorViaPath } from '@island.is/application/core'

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
  const countryField = `${fieldIndex}.countryId`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  const countryOptions = (
    getValueViaPath(application.externalData, 'countries.data', []) as Country[]
  ).map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }))

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue, wasRemovedField])

  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      {itemNumber > 0 && (
        <Box display="flex" flexDirection="row" justifyContent="flexEnd">
          <Button
            variant="text"
            size="small"
            onClick={() => handleRemove(index)}
          >
            {formatMessage(
              information.labels.countriesOfResidence.deleteButtonTitle,
            )}
          </Button>
        </Box>
      )}
      <SelectFormField
        application={application}
        error={errors && getErrorViaPath(errors, countryField)}
        field={{
          id: countryField,
          title: `${formatMessage(
            information.labels.countriesOfResidence.splitterTitle,
          )} ${itemNumber + 1}`,
          options: countryOptions,
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          required: repeaterField.wasRemoved === 'true' ? false : true,
          onSelect: (value) => addCountryToList(value.value as string, index),
        }}
        errors={errors}
      ></SelectFormField>
    </Box>
  )
}
