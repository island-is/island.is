import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Box,
  Columns,
  Column,
  Button,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { SelectFormField } from '@island.is/application/ui-fields'
import DescriptionText from '../../components/DescriptionText'
import { getValueViaPath } from '@island.is/application/core'
// import { Country } from '@island.is/clients/directorate-of-immigration/citizenship'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  id: string
  index: number
  repeaterField: any
  handleRemove: (index: number) => void
  itemNumber: number
  addDataToCountryList: (field: string, value: string, index: number) => void
  showItemTitle: boolean
}

export const RecordRepeatableItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  itemNumber,
  showItemTitle,
  addDataToCountryList,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const countryField = `${fieldIndex}.countryId`
  const dateField = `${fieldIndex}.date`
  const punishmentField = `${fieldIndex}.punishment`
  const typeOfOffenseField = `${fieldIndex}.typeOfOffense`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  const countryOptions = (
    getValueViaPath(application.externalData, 'countries.data', []) as any[]
  ).map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }))

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue])

  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginTop={showItemTitle || itemNumber > 0 ? 2 : 0}
      >
        {showItemTitle && (
          <DescriptionText
            text={information.labels.criminalRecord.itemTitle}
            format={{ index: itemNumber + 1 }}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              marginBottom: 0,
            }}
          />
        )}

        {itemNumber > 0 && (
          <Button
            variant="text"
            textSize="sm"
            size="small"
            onClick={() => handleRemove(index)}
          >
            {formatMessage(information.labels.criminalRecord.deleteButtonTitle)}
          </Button>
        )}
      </Box>
      <InputController
        id={typeOfOffenseField}
        label={formatMessage(
          information.labels.criminalRecord.typeOfOffenseLabel,
        )}
        rows={4}
        textarea
        error={errors && getErrorViaPath(errors, typeOfOffenseField)}
        onChange={(value) =>
          addDataToCountryList(
            'typeOfOffense',
            value.target.value as string,
            index,
          )
        }
        required
      />
      <SelectFormField
        application={application}
        error={errors && getErrorViaPath(errors, countryField)}
        field={{
          id: countryField,
          title: `Dvalarland`,
          options: countryOptions,
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          required: true,
          onSelect: (value) =>
            addDataToCountryList('countryId', value.value as string, index),
        }}
      ></SelectFormField>
      <Box paddingBottom={2} paddingTop={2}>
        <DatePickerController
          id={dateField}
          label={formatMessage(information.labels.criminalRecord.dateLabel)}
          error={errors && getErrorViaPath(errors, dateField)}
          onChange={(value) =>
            addDataToCountryList('dateFrom', value as string, index)
          }
          required
        />
      </Box>
      <InputController
        id={punishmentField}
        label={formatMessage(information.labels.criminalRecord.punishmentLabel)}
        rows={4}
        textarea
        error={errors && getErrorViaPath(errors, punishmentField)}
        onChange={(value) =>
          addDataToCountryList('purpose', value.target.value as string, index)
        }
        required
      />
    </Box>
  )
}
