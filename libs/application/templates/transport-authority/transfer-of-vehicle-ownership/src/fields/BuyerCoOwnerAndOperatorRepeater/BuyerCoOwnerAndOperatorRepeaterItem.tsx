import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import { CoOwnerAndOperator } from '../../shared'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: GenericFormField<CoOwnerAndOperator>
  handleRemove: (index: number) => void
  addNationalIdToCoOwners: (nationalId: string, index: number) => void
}

export const BuyerCoOwnerAndOperatorRepeaterItem: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({
  id,
  index,
  rowLocation,
  handleRemove,
  repeaterField,
  addNationalIdToCoOwners,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const userMessageId = repeaterField.type ?? 'coOwner'
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`
  const typeField = `${fieldIndex}.type`
  const wasRemovedField = `${fieldIndex}.wasRemoved`
  const needsAgeValidation = `${fieldIndex}.needsAgeValidation`

  const onNationalIdChange = (nationalId: string) => {
    addNationalIdToCoOwners(nationalId, index)
  }

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
    setValue(typeField, userMessageId)
    setValue(needsAgeValidation, userMessageId !== 'operator')
  }, [repeaterField.wasRemoved, userMessageId, setValue])

  return (
    <Box
      position="relative"
      marginTop={3}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels[userMessageId].title)} {rowLocation}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            {formatMessage(information.labels[userMessageId].remove)}
          </Button>
        </Box>
      </Box>
      <NationalIdWithName
        {...props}
        customId={fieldIndex}
        needsAgeValidation={userMessageId !== 'operator'}
        customNameLabel={formatMessage(information.labels[userMessageId].name)}
        customNationalIdLabel={formatMessage(
          information.labels[userMessageId].nationalId,
        )}
        onNationalIdChange={onNationalIdChange}
      />
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={emailField}
            name={emailField}
            type="email"
            label={formatMessage(information.labels[userMessageId].email)}
            error={errors && getErrorViaPath(errors, emailField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, emailField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <PhoneInputController
            id={phoneField}
            name={phoneField}
            label={formatMessage(information.labels[userMessageId].phone)}
            error={errors && getErrorViaPath(errors, phoneField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, phoneField, '') as string
            }
            allowedCountryCodes={['IS']}
            disableDropdown={true}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
