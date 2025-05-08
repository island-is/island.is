import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  GenericFormField,
} from '@island.is/application/types'
import {
  Box,
  Button,
  Column,
  Columns,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { SelectFormField } from '@island.is/application/ui-fields'
import { CountryOfResidence } from '../../shared'
import { information } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import { getErrorViaPath } from '@island.is/application/core'
import { DatePickerController } from '@island.is/shared/form-fields'

interface Props {
  id: string
  index: number
  repeaterField: GenericFormField<CountryOfResidence>
  handleRemove: (index: number) => void
  itemNumber: number
  addCountryToList: (field: string, value: string, index: number) => void
  readOnly?: boolean
}

export const ResidenceCountriesRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  itemNumber,
  addCountryToList,
  readOnly,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const countryField = `${fieldIndex}.countryId`
  const wasRemovedField = `${fieldIndex}.wasRemoved`
  const dateToField = `${fieldIndex}.dateTo`
  const dateFromField = `${fieldIndex}.dateFrom`
  const dateRangeField = `${fieldIndex}.dateRange`

  const countryOptions = (
    getValueViaPath(
      application.externalData,
      'countries.data',
      [],
    ) as OptionSetItem[]
  ).map(({ id, name }) => ({
    value: id?.toString() || '',
    label: name || '',
  }))

  const dateRangeError =
    errors &&
    getErrorViaPath(errors, dateRangeField) &&
    getErrorViaPath(errors, dateRangeField).length > 0
      ? true
      : false

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue, wasRemovedField])

  useEffect(() => {
    setValue(countryField, repeaterField.countryId)
  }, [repeaterField.countryId, setValue, countryField])

  useEffect(() => {
    setValue(dateToField, repeaterField.dateTo)
  }, [repeaterField.dateTo, setValue, dateToField])

  useEffect(() => {
    setValue(dateFromField, repeaterField.dateFrom)
  }, [repeaterField.dateFrom, setValue, dateFromField])

  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      {itemNumber > 0 && !readOnly && (
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
          disabled: readOnly,
          type: FieldTypes.SELECT,
          required: repeaterField.wasRemoved === 'true' ? false : true,
          backgroundColor: 'blue',
          onSelect: (value) =>
            addCountryToList('countryId', value.value as string, index),
        }}
        errors={errors}
      ></SelectFormField>
      <Box paddingBottom={2} paddingTop={2}>
        {dateRangeError && (
          <InputError
            errorMessage={formatMessage(
              information.labels.staysAbroad.dateRangeError,
            )}
          />
        )}
        <Columns space={3}>
          <Column>
            <DatePickerController
              id={dateFromField}
              locale={lang}
              disabled={readOnly}
              label={formatMessage(
                information.labels.staysAbroad.dateFromLabel,
              )}
              error={errors && getErrorViaPath(errors, dateFromField)}
              onChange={(value) =>
                addCountryToList('dateFrom', value as string, index)
              }
              maxDate={new Date()}
              backgroundColor="blue"
              required
            />
          </Column>
          <Column>
            <DatePickerController
              id={dateToField}
              locale={lang}
              disabled={readOnly}
              label={formatMessage(information.labels.staysAbroad.dateToLabel)}
              error={errors && getErrorViaPath(errors, dateToField)}
              onChange={(value) =>
                addCountryToList('dateTo', value as string, index)
              }
              maxDate={new Date()}
              backgroundColor="blue"
              required
            />
          </Column>
        </Columns>
      </Box>
    </Box>
  )
}
