import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { EstateTypes, YES } from '../../lib/constants'
import { GenericFormField, Application } from '@island.is/application/types'
import { EstateMember } from '../../types'
import { hasYes } from '@island.is/application/core'
import { LookupPerson } from '../LookupPerson'
import { useEffect } from 'react'

export const AdditionalEstateMember = ({
  field,
  index,
  remove,
  fieldName,
  relationOptions,
  relationWithApplicantOptions,
  error,
  application,
}: {
  application: Application
  field: GenericFormField<EstateMember>
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  relationWithApplicantOptions: { value: string; label: string }[]
  error: Record<string, string>
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const relationField = `${fieldIndex}.relation`
  const relationWithApplicantField = `${fieldIndex}.relationWithApplicant`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const phoneField = `${fieldIndex}.phone`
  const emailField = `${fieldIndex}.email`

  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  const { control, setValue, clearErrors } = useFormContext()

  useEffect(() => {
    clearErrors(nameField)
    clearErrors(relationField)
    clearErrors(dateOfBirthField)
    clearErrors(`${fieldIndex}.nationalId`)
  }, [foreignCitizenship])

  return (
    <Box position="relative" key={field.id} marginTop={7}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
        render={() => <input type="hidden" />}
      />
      <Box display={'flex'} justifyContent="spaceBetween">
        <Text variant="h4">{formatMessage(m.estateMember)}</Text>
        <Box>
          <Button
            variant="text"
            size="small"
            icon="trash"
            onClick={() => {
              remove(index)
            }}
          >
            {formatMessage(m.inheritanceDeleteMember)}
          </Button>
        </Box>
      </Box>
      {foreignCitizenship?.length ? (
        <GridRow>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
            <InputController
              key={nameField}
              id={nameField}
              name={nameField}
              backgroundColor="blue"
              defaultValue={field.name}
              error={error?.name ?? undefined}
              label={formatMessage(m.inheritanceNameLabel)}
              required
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
            <DatePickerController
              label={formatMessage(m.inheritanceDayOfBirthLabel)}
              placeholder={formatMessage(m.inheritanceDayOfBirthLabel)}
              id={dateOfBirthField}
              key={dateOfBirthField}
              name={dateOfBirthField}
              locale="is"
              maxDate={new Date()}
              backgroundColor="blue"
              onChange={(d) => {
                setValue(dateOfBirthField, d)
              }}
              error={error?.dateOfBirth ?? undefined}
            />
          </GridColumn>
        </GridRow>
      ) : (
        <Box paddingY={2}>
          <LookupPerson
            field={{ id: fieldIndex, props: { alertWhenUnder18: true } }}
            error={error}
          />
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <SelectController
            key={relationField}
            id={relationField}
            name={relationField}
            label={formatMessage(m.inheritanceRelationLabel)}
            defaultValue={field.relation}
            options={relationOptions}
            error={error?.relation}
            backgroundColor="blue"
            required
          />
        </GridColumn>
        {application.answers.selectedEstate ===
          EstateTypes.permitForUndividedEstate && (
          <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
            <SelectController
              key={relationWithApplicantField}
              id={relationWithApplicantField}
              name={relationWithApplicantField}
              label={formatMessage(m.inheritanceRelationWithApplicantLabel)}
              defaultValue={field.relationWithApplicant}
              options={relationWithApplicantOptions}
              error={error?.relationWithApplicant}
              backgroundColor="blue"
              required={!field.initial}
            />
          </GridColumn>
        )}
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={emailField}
            name={emailField}
            label={m.email.defaultMessage}
            defaultValue={field.email || ''}
            backgroundColor="blue"
            error={error?.email}
            required
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={phoneField}
            name={phoneField}
            label={m.phone.defaultMessage}
            defaultValue={field.phone || ''}
            backgroundColor="blue"
            format={'###-####'}
            error={error?.phone}
            required
          />
        </GridColumn>
        <GridColumn span="1/1" paddingBottom={2}>
          <Box width="half">
            <CheckboxController
              key={foreignCitizenshipField}
              id={foreignCitizenshipField}
              name={foreignCitizenshipField}
              defaultValue={field?.foreignCitizenship || []}
              options={[
                {
                  label: formatMessage(m.inheritanceForeignCitizenshipLabel),
                  value: YES,
                },
              ]}
              onSelect={(val) => {
                setValue(foreignCitizenshipField, val)
              }}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default AdditionalEstateMember
