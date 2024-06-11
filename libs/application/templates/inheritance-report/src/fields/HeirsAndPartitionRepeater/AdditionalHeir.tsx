/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { GenericFormField, YES } from '@island.is/application/types'
import { hasYes } from '@island.is/application/core'
import { Fragment, useEffect, useMemo } from 'react'
import { EstateMember } from '../../types'
import {
  ErrorValue,
  PREPAID_INHERITANCE,
  RelationSpouse,
} from '../../lib/constants'
import { LookupPerson } from '../LookupPerson'
import { HeirsAndPartitionRepeaterProps } from './types'
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
}: {
  customFields: HeirsAndPartitionRepeaterProps['field']['props']['customFields']
  field: GenericFormField<EstateMember>
  index: number
  remove: (index?: number | number[] | undefined) => void
  updateValues: (updateIndex: string, value: number, index?: number) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  error: Record<string, string>
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

  const advocateField = `${fieldIndex}.advocate`
  const advocatePhoneField = `${advocateField}.phone`
  const advocateEmailField = `${advocateField}.email`

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

      <GridRow>
        {customFields.map((customField: any, customFieldIndex) => {
          const defaultValue = currentHeir?.[customField.id]
          return (
            <Fragment key={customFieldIndex}>
              {customField?.sectionTitle ? (
                <GridColumn span="1/1">
                  <Text variant="h5" marginBottom={2}>
                    {customField.sectionTitle}
                  </Text>
                </GridColumn>
              ) : null}

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
                {formatMessage(m.inheritanceAdvocateLabel)}
              </Text>
            </GridColumn>
            <GridColumn span={['1/1']} paddingBottom={2}>
              <LookupPerson
                nested
                field={{
                  id: `${fieldIndex}.advocate`,
                }}
                backgroundColor="blue"
                error={error}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={advocatePhoneField}
                name={advocatePhoneField}
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
      <GridRow>
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

export default AdditionalHeir
