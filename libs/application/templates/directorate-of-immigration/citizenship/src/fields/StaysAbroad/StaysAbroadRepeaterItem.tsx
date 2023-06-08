import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, FieldComponents, FieldTypes, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController, InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import { SelectFormField } from '@island.is/application/ui-fields'
import { fetchCountries } from '../../utils/getCountries'
// import { CoOwnerAndOperator } from '../../shared'

interface Props {
  id: string
  index: number
  repeaterField: any//GenericFormField<CoOwnerAndOperator>
  handleRemove: (index: number) => void
  itemNumber: number
  addCountryToList: (field: string, value: string, index: number) => void
}

export const StaysAbroadRepeaterItem: FC<Props & FieldBaseProps> = ({
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
  const dateToField = `${fieldIndex}.dateTo`
  const dateFromField = `${fieldIndex}.dateFrom`
  const purposeField = `${fieldIndex}.purpose`
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
      <SelectFormField
        application={application}
        field={{
          id: countryField,
          title: `Dvalarland ${itemNumber+1}`,
          options: countryOptions,
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          onSelect: (value) => addCountryToList(countryField, value.value as string, index)
        }}
        ></SelectFormField>
        <Box paddingBottom={2} paddingTop={2}>
            <Columns space={3}>
                <Column>
                    <DatePickerController 
                        id={dateFromField}
                        label={information.labels.staysAbroad.dateFromLabel.defaultMessage}
                    />
                </Column>
                <Column>
                    <DatePickerController 
                        id={dateToField}
                        label={information.labels.staysAbroad.dateToLabel.defaultMessage}
                    />
                </Column>
            </Columns>
        </Box>
        <InputController 
            id={purposeField}
            label={information.labels.staysAbroad.purposeLabel.defaultMessage}
            rows={4}
            textarea
        />
    </Box>
  )
}
