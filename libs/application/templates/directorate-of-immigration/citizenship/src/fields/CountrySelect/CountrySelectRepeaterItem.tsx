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
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
// import { CoOwnerAndOperator } from '../../shared'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: any//GenericFormField<CoOwnerAndOperator>
  handleRemove: (index: number) => void
  addNationalIdToCoOwners: (nationalId: string, index: number) => void
}

export const CountrySelectRepeaterItem: FC<Props & FieldBaseProps> = ({
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

  const onCountryChange = (nationalId: string) => {
    //addNationalIdToCoOwners(nationalId, index)
    console.log('country change')
  }

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
    setValue(typeField, userMessageId)
  }, [repeaterField.wasRemoved, userMessageId, setValue])

  return (
    <Box
      position="relative"
      marginTop={3}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          Title here{/* {formatMessage(information.labels[userMessageId].title)} {rowLocation} */}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            remove here{/* {formatMessage(information.labels[userMessageId].remove)} */}
          </Button>
        </Box>
      </Box>
      {/* <NationalIdWithName
        {...props}
        customId={fieldIndex}
        customNameLabel={formatMessage(information.labels[userMessageId].name)}
        customNationalIdLabel={formatMessage(
          information.labels[userMessageId].nationalId,
        )}
        onNationalIdChange={onCountryChange}
      /> */}
    </Box>
  )
}
