import React, { FC, Fragment, useEffect } from 'react'
import {
  ArrayField,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { Box, Button, GridRow, GridContainer } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'

type Props = {
  id: any
  index: any
  application: any
  handleAddCaretaker: any
  field: any
  errors: any
}

const Item = ({
  id,
  index,
  application,
  handleAddCaretaker,
  field,
  errors,
}: Props) => {
  const { formatMessage } = useLocale()

  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const roleField = `${fieldIndex}.role`

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <Box width="half" paddingTop={3} paddingRight={2}>
          <InputController
            id={nameField}
            name={nameField}
            label={formatMessage(m.fullName)}
            backgroundColor="blue"
          />
        </Box>
        <Box width="half" paddingTop={3} paddingRight={2}>
          <InputController
            id={nationalIdField}
            name={nationalIdField}
            label={formatMessage(m.nationalId)}
            format="######-####"
            backgroundColor="blue"
            defaultValue={
              getValueViaPath(
                application.answers,
                nationalIdField,
                '',
              ) as string
            }
          />
        </Box>
      </GridRow>
      <GridRow align="spaceBetween">
        <Box width="half" paddingTop={2} paddingRight={2}>
          <SelectController
            id={roleField}
            name={roleField}
            label={formatMessage(m.role)}
            placeholder={formatMessage(m.selectRole)}
            backgroundColor="blue"
            options={[
              { label: 'Skoðunarmaður', value: 'Skoðunarmaður' },
              { label: 'Stjórnarmaður', value: 'Stjórnarmaður' },
            ]}
          />
        </Box>
      </GridRow>
    </GridContainer>
  )
}

export const CemetryCaretakerRepeater: FC<FieldBaseProps<
  FinancialStatementsInao
>> = ({ application, field, errors }) => {
  const { formatMessage } = useLocale()
  const { id } = field

  const { fields, append, remove } = useFieldArray({
    name: `${id}.caretakers`,
  })

  const handleAddCaretaker = () =>
    append({
      nationalId: '',
      name: '',
      role: '',
    })

  useEffect(() => {
    if (fields.length === 0) handleAddCaretaker()
  }, [fields])

  return (
    <GridContainer>
      {fields.map((field, index) => (
        <Box key={field.id} hidden={field.initial || field?.dummy}>
          <Item
            id={id}
            application={application}
            field={field}
            handleAddCaretaker={handleAddCaretaker}
            index={index}
            key={field.id}
            errors={errors}
          />
        </Box>
      ))}
      <GridRow>
        <Box paddingTop={2}>
          <Button
            variant="ghost"
            icon="add"
            iconType="outline"
            size="small"
            onClick={handleAddCaretaker}
          >
            {formatMessage(m.add)}
          </Button>
        </Box>
      </GridRow>
    </GridContainer>
  )
}
