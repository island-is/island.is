/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  PhoneInputController,
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
import { GenericFormField } from '@island.is/application/types'
import { hasYes, YES } from '@island.is/application/core'
import { Fragment, useEffect, useMemo } from 'react'
import { EstateMember } from '../../types'
import {
  ErrorValue,
  PREPAID_INHERITANCE,
  RelationSpouse,
} from '../../lib/constants'
import { LookupPerson } from '../LookupPerson'
import { HeirsRepeaterProps } from './types'
import ShareInput from '../../components/ShareInput'

export const AdditionalHeir = ({
  field,
  customFields,
  index,
  remove,
  updateValues,
  fieldName,
  relationOptions,
  error,
  isPrepaid,
}: {
  customFields: HeirsRepeaterProps['field']['props']['customFields']
  field: GenericFormField<EstateMember>
  index: number
  remove: (index?: number | number[] | undefined) => void
  updateValues: (updateIndex: string, value: number, index?: number) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  error: Record<string, string>
  isPrepaid: boolean
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const relationField = `${fieldIndex}.relation`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const phoneField = `${fieldIndex}.phone`
  const emailField = `${fieldIndex}.email`

  // Advocate
  const advocateField = `${fieldIndex}.advocate`
  const advocatePhoneField = `${advocateField}.phone`
  const advocateEmailField = `${advocateField}.email`

  // Advocate 2
  const advocateField2 = `${fieldIndex}.advocate2`
  const advocatePhoneField2 = `${advocateField2}.phone`
  const advocateEmailField2 = `${advocateField2}.email`

  const foreignCitizenship = useWatch({
    name: `${fieldIndex}.foreignCitizenship`,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  const { control, setValue, clearErrors, getValues, unregister } =
    useFormContext()

  const values = getValues()

  const currentHeir = useMemo(
    () => values?.heirs?.data?.[index],
    [values, index],
  )

  const hasForeignCitizenship = currentHeir?.foreignCitizenship?.[0] === YES
  const birthDate = currentHeir?.dateOfBirth

  const memberAge =
    hasForeignCitizenship && birthDate
      ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
          ?.years
      : kennitala.info(currentHeir?.nationalId)?.age

  const hideContactInfo =
    kennitala.isPerson(currentHeir?.nationalId) &&
    memberAge !== undefined &&
    memberAge < 18

  const requiresAdvocate = useMemo(() => {
    return memberAge !== undefined && memberAge < 18
  }, [memberAge])

  const isDisabledField =
    values.applicationFor === PREPAID_INHERITANCE ? false : !currentHeir.enabled

  useEffect(() => {
    clearErrors(nameField)
    clearErrors(relationField)
    clearErrors(dateOfBirthField)
    clearErrors(advocatePhoneField)
    clearErrors(advocateEmailField)
    clearErrors(`${fieldIndex}.nationalId`)

    if (!requiresAdvocate) {
      const obj = getValues(advocateField)

      if (obj) {
        const hasValues = Object.entries(obj).reduce((acc, [key, _]) => {
          if (obj[key]) {
            return true
          }

          return acc
        }, false)

        // if advocate was filled out but then removed
        if (hasValues) {
          setValue(advocateField, undefined)
          unregister(advocateField)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foreignCitizenship, requiresAdvocate])

  return (
    <Box position="relative" key={field.id} marginTop={3}>
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
        <Text variant="h4">{formatMessage(m.heir)}</Text>
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
              defaultValue={field.name}
              backgroundColor="white"
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
              defaultValue={field.dateOfBirth}
              maxDate={new Date()}
              minYear={1900}
              required
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
            field={{
              id: `${fieldIndex}`,
              props: {
                requiredNationalId: true,
              },
            }}
            backgroundColor="blue"
            error={error}
          />
        </Box>
      )}
      <GridRow>
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
              <PhoneInputController
                id={phoneField}
                name={phoneField}
                label={formatMessage(m.phone)}
                defaultValue={field.phone || ''}
                backgroundColor="blue"
                error={error?.phone}
                required
              />
            </GridColumn>
          </>
        )}
      </GridRow>

      <GridRow>
        {customFields.map((customField: any, customFieldIndex) => {
          const defaultValue = currentHeir?.[customField.id]
          return (
            <Fragment key={customFieldIndex}>
              {customField.id === 'relation' ? (
                <GridColumn span="1/2" paddingBottom={2}>
                  <SelectController
                    id={relationField}
                    name={relationField}
                    label={formatMessage(
                      m.inheritanceRelationWithApplicantLabel,
                    )}
                    onSelect={() => {
                      clearErrors()
                      // Recalculate values when relation changes (affects tax calculations)
                      const currentPercentage =
                        currentHeir?.heirsPercentage ?? 0
                      updateValues(
                        fieldIndex,
                        parseFloat(currentPercentage),
                        index,
                      )
                    }}
                    defaultValue={currentHeir?.relation ?? ''}
                    options={relationOptions}
                    error={error?.relation}
                    backgroundColor="blue"
                    disabled={isDisabledField}
                    required
                  />
                </GridColumn>
              ) : customField.id === 'heirsPercentage' ? (
                <GridColumn span="1/2" paddingBottom={2}>
                  <ShareInput
                    name={`${fieldIndex}.${customField.id}`}
                    disabled={isDisabledField}
                    label={formatMessage(customField.title)}
                    onAfterChange={(val) => {
                      updateValues(fieldIndex, val, customFieldIndex)
                    }}
                    hasError={!!error?.heirsPercentage}
                    required
                  />
                </GridColumn>
              ) : customField.id === 'taxFreeInheritance' &&
                values.applicationFor === PREPAID_INHERITANCE &&
                currentHeir?.relation !== RelationSpouse ? null : (
                <GridColumn span={['1/2']} paddingBottom={2}>
                  <InputController
                    id={`${fieldIndex}.${customField.id}`}
                    name={`${fieldIndex}.${customField.id}`}
                    disabled={isDisabledField}
                    defaultValue={defaultValue ? defaultValue : ''}
                    format={customField.format}
                    label={formatMessage(customField.title)}
                    currency
                    readOnly
                    error={
                      error && error[index]
                        ? error[index][customField.id]
                        : undefined
                    }
                  />
                </GridColumn>
              )}
            </Fragment>
          )
        })}
      </GridRow>
      <GridRow>
        <GridColumn span="1/1" paddingBottom={3}>
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
      {/* ADVOCATE */}
      {(currentHeir?.nationalId || hasForeignCitizenship) && requiresAdvocate && (
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
                {formatMessage(
                  isPrepaid
                    ? m.inheritanceAdvocateLabelPrePaid
                    : m.inheritanceAdvocateLabel,
                )}
              </Text>
            </GridColumn>
            <GridColumn span={['1/1']} paddingBottom={2}>
              <LookupPerson
                nested
                field={{
                  id: `${fieldIndex}.advocate`,
                }}
                backgroundColor="blue"
                error={error?.advocate as unknown as ErrorValue}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <PhoneInputController
                id={advocatePhoneField}
                name={advocatePhoneField}
                label={formatMessage(m.phone)}
                backgroundColor="blue"
                error={(error?.advocate as unknown as ErrorValue)?.phone}
                size="sm"
                required
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={advocateEmailField}
                name={advocateEmailField}
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
      {(currentHeir?.nationalId || hasForeignCitizenship) && requiresAdvocate && (
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
                {formatMessage(
                  isPrepaid
                    ? m.inheritanceAdvocateLabelPrePaid
                    : m.inheritanceAdvocateLabel,
                )}
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
                backgroundColor="blue"
                error={error}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <PhoneInputController
                id={advocatePhoneField2}
                name={advocatePhoneField2}
                label={formatMessage(m.phone)}
                backgroundColor="blue"
                size="sm"
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={advocateEmailField2}
                name={advocateEmailField2}
                label={formatMessage(m.email)}
                backgroundColor="blue"
                size="sm"
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default AdditionalHeir
