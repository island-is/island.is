import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
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
import { information } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'

interface Props {
  id: string
  index: number
  rowLocation: number
  handleRemove: (index: number) => void
  wasRemoved: boolean
}

export const OwnerCoOwners: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({ id, index, rowLocation, handleRemove, wasRemoved, ...props }) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`
  const nameField = `${fieldIndex}.name`
  const nationaIdField = `${fieldIndex}.nationalId`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  useEffect(() => {
    setValue(wasRemovedField, `${wasRemoved}`)
  }, [wasRemoved, setValue])

  return (
    <Box position="relative" marginBottom={4} hidden={wasRemoved}>
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels.coOwner.title)} {rowLocation}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            {formatMessage(information.labels.coOwner.remove)}
          </Button>
        </Box>
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationaIdField}
            name={nationaIdField}
            format="######-####"
            label={formatMessage(information.labels.coOwner.nationalId)}
            error={errors && getErrorViaPath(errors, nationaIdField)}
            backgroundColor="white"
            readOnly
            defaultValue={
              getValueViaPath(application.answers, nationaIdField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            name={nameField}
            type="email"
            label={formatMessage(information.labels.coOwner.name)}
            error={errors && getErrorViaPath(errors, nameField)}
            backgroundColor="white"
            readOnly
            defaultValue={
              getValueViaPath(application.answers, nameField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={emailField}
            name={emailField}
            type="email"
            label={formatMessage(information.labels.coOwner.email)}
            error={errors && getErrorViaPath(errors, emailField)}
            backgroundColor="white"
            readOnly
            defaultValue={
              getValueViaPath(application.answers, emailField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <PhoneInputController
            id={phoneField}
            name={phoneField}
            label={formatMessage(information.labels.coOwner.phone)}
            error={errors && getErrorViaPath(errors, phoneField)}
            backgroundColor="white"
            readOnly
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
