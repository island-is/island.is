import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import * as kennitala from 'kennitala'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import intervalToDuration from 'date-fns/intervalToDuration'
import { GenericFormField, Application, YES } from '@island.is/application/types'
import { hasYes } from '@island.is/application/core'
import { useEffect } from 'react'
import { EstateMember, EstateTypes } from '../../types'
// import { LookupPerson } from '../LookupPerson'
import { ErrorValue } from '../../lib/constants'

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

  const advocatePhone = `${fieldIndex}.advocate.phone`
  const advocateEmail = `${fieldIndex}.advocate.email`

  const selectedEstate = application.answers.selectedEstate

  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  const { control, setValue, clearErrors, getValues } = useFormContext()

  console.log('error', error)

  const values = getValues()
  console.log('AdditionalEstateMember')
  console.log('values', values)

  const currentEstateMember = values?.estate?.estateMembers?.[index]

  const hasForeignCitizenship =
    currentEstateMember?.foreignCitizenship?.[0] === 'Yes'
  const birthDate = currentEstateMember?.dateOfBirth

  const memberAge =
    hasForeignCitizenship && birthDate
      ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
          ?.years
      : kennitala.info(currentEstateMember.nationalId)?.age

  const hideContactInfo =
    kennitala.isPerson(currentEstateMember.nationalId) &&
    memberAge !== undefined &&
    memberAge < 18

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
        {/* <Text variant="h4">{formatMessage(m.estateMember)}</Text> */}
        <Text variant="h4">m.estateMember</Text>
        <Box>
          <Button
            variant="text"
            size="small"
            icon="trash"
            onClick={() => {
              remove(index)
            }}
          >
            {/* {formatMessage(m.inheritanceDeleteMember)} */}
            m.inheritanceDeleteMember
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
              // label={formatMessage(m.inheritanceNameLabel)}
              label={'m.inheritanceNameLabel'}
              required
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
            <DatePickerController
              // label={formatMessage(m.inheritanceDayOfBirthLabel)}
              label={'m.inheritanceDayOfBirthLabel'}
              // placeholder={formatMessage(m.inheritanceDayOfBirthLabel)}
              placeholder={'m.inheritanceDayOfBirthLabel'}
              id={dateOfBirthField}
              key={dateOfBirthField}
              name={dateOfBirthField}
              locale="is"
              maxDate={new Date()}
              minYear={1900}
              maxYear={new Date().getFullYear()}
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
          {/* <LookupPerson
            // message={formatMessage(m.inheritanceUnder18Error)}
            message={'m.inheritanceUnder18Error'}
            field={{
              id: `${fieldIndex}`,
              props: {
                alertWhenUnder18:
                  selectedEstate === EstateTypes.divisionOfEstateByHeirs,
                requiredNationalId: true,
              },
            }}
            error={error}
          /> */}
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <SelectController
            key={relationField}
            id={relationField}
            name={relationField}
            // label={formatMessage(m.inheritanceRelationLabel)}
            label={'m.inheritanceRelationLabel'}
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
              // label={formatMessage(m.inheritanceRelationWithApplicantLabel)}
              label={'m.inheritanceRelationWithApplicantLabel'}
              defaultValue={field.relationWithApplicant}
              options={relationWithApplicantOptions}
              error={error?.relationWithApplicant}
              backgroundColor="blue"
              required={!field.initial}
            />
          </GridColumn>
        )}
        {!hideContactInfo && (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={emailField}
                name={emailField}
                label={formatMessage(m.email)}
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
                label={formatMessage(m.phone)}
                defaultValue={field.phone || ''}
                backgroundColor="blue"
                format={'###-####'}
                error={error?.phone}
                required
              />
            </GridColumn>
          </>
        )}
      </GridRow>
      {/* ADVOCATE */}
      {selectedEstate !== EstateTypes.divisionOfEstateByHeirs &&
        (currentEstateMember?.nationalId || hasForeignCitizenship) &&
        memberAge !== undefined &&
        memberAge < 18 && (
          <Box
            marginTop={2}
            marginBottom={2}
            paddingY={5}
            paddingX={7}
            borderRadius="large"
            border="standard"
          >
            <GridRow>
              <GridColumn span={['1/1']} paddingBottom={2}>
                <Text variant="h4">
                  {/* {formatMessage(m.inheritanceAdvocateLabel)} */}
                  m.inheritanceAdvocateLabel
                </Text>
              </GridColumn>
              <GridColumn span={['1/1']} paddingBottom={2}>
                {/* <LookupPerson
                  message={
                    selectedEstate === EstateTypes.divisionOfEstateByHeirs
                      ? 'm.inheritanceUnder18Error'
                      : 'm.inheritanceUnder18ErrorAdvocate'
                      // ? formatMessage(m.inheritanceUnder18Error)
                      // : formatMessage(m.inheritanceUnder18ErrorAdvocate)
                  }
                  nested
                  field={{
                    id: `${fieldIndex}.advocate`,
                    props: {
                      alertWhenUnder18:
                        selectedEstate !==
                          EstateTypes.divisionOfEstateByHeirs &&
                        memberAge !== undefined &&
                        memberAge < 18,
                    },
                  }}
                  error={error}
                /> */}
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={advocatePhone}
                  name={advocatePhone}
                  label={formatMessage(m.phone)}
                  backgroundColor="blue"
                  format="###-####"
                  error={(error?.advocate as unknown as ErrorValue)?.phone}
                  size="sm"
                  required
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={advocateEmail}
                  name={advocateEmail}
                  label={formatMessage(m.email)}
                  backgroundColor="blue"
                  error={(error?.advocate as unknown as ErrorValue)?.email}
                  size="sm"
                  required
                />
              </GridColumn>
            </GridRow>
          </Box>
        )}
      <GridColumn span="1/1" paddingBottom={2}>
        <Box width="half">
          <CheckboxController
            key={foreignCitizenshipField}
            id={foreignCitizenshipField}
            name={foreignCitizenshipField}
            defaultValue={field?.foreignCitizenship || []}
            options={[
              {
                // label: formatMessage(m.inheritanceForeignCitizenshipLabel),
                label: 'm.inheritanceForeignCitizenshipLabel',
                value: YES,
              },
            ]}
            onSelect={(val) => {
              setValue(foreignCitizenshipField, val)
            }}
          />
        </Box>
      </GridColumn>
    </Box>
  )
}

export default AdditionalEstateMember
