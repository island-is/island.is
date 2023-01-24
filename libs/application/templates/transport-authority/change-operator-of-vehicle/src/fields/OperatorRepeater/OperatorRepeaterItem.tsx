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
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { ArrayField } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import { OperatorInformation } from '../../shared'
import { OperatorField } from '../../types'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: Partial<ArrayField<OperatorInformation, 'id'>>
  handleRemove: (index: number) => void
  setTempNewOperators?: (s: OperatorField[]) => void
  tempNewOperators?: OperatorField[]
}

export const OperatorRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  rowLocation,
  handleRemove,
  repeaterField,
  setTempNewOperators,
  tempNewOperators,
  ...props
}) => {
  const [nationalId, setNationalId] = useState<string>(
    repeaterField.nationalId || '',
  )
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`

  useEffect(() => {
    if (setTempNewOperators && tempNewOperators && index > -1) {
      const temp = [...tempNewOperators]
      const itemValue = {
        nationalId,
      }
      temp[index] = itemValue
      setTempNewOperators(temp)
    }
  }, [nationalId])

  return (
    <Box position="relative" key={repeaterField.id} marginBottom={4}>
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels.operator.operatorTempTitle)}{' '}
          {rowLocation}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            {formatMessage(information.labels.operator.remove)}
          </Button>
        </Box>
      </Box>
      <NationalIdWithName
        {...props}
        customId={fieldIndex}
        customNameLabel={formatMessage(information.labels.operator.name)}
        customNationalIdLabel={formatMessage(
          information.labels.operator.nationalId,
        )}
        onNationalIdChange={setNationalId}
      />
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={emailField}
            name={emailField}
            type="email"
            label={formatMessage(information.labels.operator.email)}
            error={errors && getErrorViaPath(errors, emailField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, emailField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={phoneField}
            name={phoneField}
            type="tel"
            format="###-####"
            label={formatMessage(information.labels.operator.phone)}
            error={errors && getErrorViaPath(errors, phoneField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, phoneField, '') as string
            }
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
