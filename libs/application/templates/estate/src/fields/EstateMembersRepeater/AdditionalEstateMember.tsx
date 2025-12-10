import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  PhoneInputController,
  SelectController,
} from '@island.is/shared/form-fields'
import * as nationalId from 'kennitala'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { EstateTypes, YES, SPOUSE } from '../../lib/constants'
import intervalToDuration from 'date-fns/intervalToDuration'
import { GenericFormField, Application } from '@island.is/application/types'
import { ErrorValue, EstateMember } from '../../types'
import { hasYes } from '@island.is/application/core'
import { LookupPerson } from '../LookupPerson'

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
  const noContactInfoField = `${fieldIndex}.noContactInfo`
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const phoneField = `${fieldIndex}.phone`
  const emailField = `${fieldIndex}.email`

  // Advocate
  const advocatePhone = `${fieldIndex}.advocate.phone`
  const advocateEmail = `${fieldIndex}.advocate.email`

  // Advocate 2
  const advocate2Phone = `${fieldIndex}.advocate2.phone`
  const advocate2Email = `${fieldIndex}.advocate2.email`

  const selectedEstate = application.answers.selectedEstate

  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  const relation = useWatch({
    name: relationField,
    defaultValue: field.relation,
  })

  const allEstateMembers = useWatch({
    name: 'estate.estateMembers',
  })

  const { control, setValue, clearErrors, getValues } = useFormContext()

  const values = getValues()
  const currentEstateMember = values?.estate?.estateMembers?.[index]

  // Check if there's already a spouse in the heirs list (excluding the current member)
  const hasExistingSpouse = allEstateMembers?.some(
    (member: EstateMember, memberIndex: number) =>
      memberIndex !== index && member.enabled && member.relation === SPOUSE,
  )

  // Filter out SPOUSE from relation options if there's already a spouse
  const filteredRelationOptions = hasExistingSpouse
    ? relationOptions.filter((option) => option.value !== SPOUSE)
    : relationOptions

  const hasForeignCitizenship =
    currentEstateMember?.foreignCitizenship?.[0] === YES
  const birthDate = currentEstateMember?.dateOfBirth
  const noContactInfo = currentEstateMember?.noContactInfo?.[0] === YES
  const memberAge =
    hasForeignCitizenship && birthDate
      ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
          ?.years
      : nationalId.info(currentEstateMember.nationalId)?.age

  const hideContactInfo =
    nationalId.isPerson(currentEstateMember.nationalId) &&
    memberAge !== undefined &&
    memberAge < 18

  const requiresAdvocate = memberAge !== undefined && memberAge < 18

  useEffect(() => {
    clearErrors(nameField)
    clearErrors(relationField)
    clearErrors(dateOfBirthField)
    clearErrors(`${fieldIndex}.nationalId`)
  }, [
    foreignCitizenship,
    clearErrors,
    nameField,
    relationField,
    dateOfBirthField,
    fieldIndex,
  ])

  // Clear relationWithApplicant when relation is changed to SPOUSE
  useEffect(() => {
    if (relation === SPOUSE && currentEstateMember?.relationWithApplicant) {
      setValue(relationWithApplicantField, '')
      clearErrors(relationWithApplicantField)
    }
  }, [
    relation,
    currentEstateMember?.relationWithApplicant,
    setValue,
    clearErrors,
    relationWithApplicantField,
  ])

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
          <LookupPerson
            message={formatMessage(m.inheritanceUnder18Error)}
            field={{
              id: `${fieldIndex}`,
              props: {
                alertWhenUnder18:
                  selectedEstate === EstateTypes.divisionOfEstateByHeirs,
                requiredNationalId: true,
              },
            }}
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
            options={filteredRelationOptions}
            error={error?.relation}
            backgroundColor="blue"
            required={!field.initial}
          />
        </GridColumn>
        {selectedEstate === EstateTypes.permitForUndividedEstate &&
          relation !== SPOUSE && (
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
                required={!noContactInfo}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <PhoneInputController
                id={phoneField}
                name={phoneField}
                label={formatMessage(m.phone)}
                backgroundColor="blue"
                error={error?.phone}
                required={!noContactInfo}
              />
            </GridColumn>
          </>
        )}
      </GridRow>
      {/* ADVOCATE */}
      {(currentEstateMember?.nationalId || hasForeignCitizenship) &&
        requiresAdvocate && (
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
                  {formatMessage(m.inheritanceAdvocateLabel)}
                </Text>
              </GridColumn>
              <GridColumn span={['1/1']} paddingBottom={2}>
                <LookupPerson
                  message={
                    selectedEstate === EstateTypes.divisionOfEstateByHeirs
                      ? formatMessage(m.inheritanceUnder18Error)
                      : formatMessage(m.inheritanceUnder18ErrorAdvocate)
                  }
                  nested
                  field={{
                    id: `${fieldIndex}.advocate`,
                    props: {
                      alertWhenUnder18: requiresAdvocate,
                    },
                  }}
                  error={error}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <PhoneInputController
                  id={advocatePhone}
                  name={advocatePhone}
                  label={formatMessage(m.phone)}
                  backgroundColor="blue"
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
      {/* ADVOCATE 2 */}
      {selectedEstate === EstateTypes.divisionOfEstateByHeirs &&
        (currentEstateMember?.nationalId || hasForeignCitizenship) &&
        requiresAdvocate && (
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
                  {formatMessage(m.inheritanceAdvocateLabel)}
                </Text>
              </GridColumn>
              <GridColumn span={['1/1']} paddingBottom={2}>
                <LookupPerson
                  nested
                  field={{
                    id: `${fieldIndex}.advocate2`,
                    props: {
                      requiredNationalId: false,
                    },
                  }}
                  message={formatMessage(m.inheritanceUnder18ErrorAdvocate)}
                  error={error}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <PhoneInputController
                  id={advocate2Phone}
                  name={advocate2Phone}
                  label={formatMessage(m.phone)}
                  backgroundColor="blue"
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={advocate2Email}
                  name={advocate2Email}
                  label={formatMessage(m.email)}
                  backgroundColor="blue"
                  size="sm"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )}

      <GridRow>
        <GridColumn
          span={
            selectedEstate === EstateTypes.estateWithoutAssets
              ? ['1/1', '1/2']
              : '1/1'
          }
          paddingBottom={2}
        >
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
        {selectedEstate === EstateTypes.estateWithoutAssets && (
          <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
            <Box width="half">
              <CheckboxController
                id={noContactInfoField}
                name={noContactInfoField}
                defaultValue={[]}
                options={[
                  {
                    label: formatMessage(m.noContactInfo),
                    value: YES,
                  },
                ]}
                onSelect={(val) => {
                  setValue(noContactInfoField, val)
                }}
              />
            </Box>
          </GridColumn>
        )}
      </GridRow>
    </Box>
  )
}

export default AdditionalEstateMember
