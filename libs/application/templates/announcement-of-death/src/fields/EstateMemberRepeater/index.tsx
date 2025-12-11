import React, { FC, useEffect } from 'react'
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, EstateMemberField } from '../../types'
import { format as formatNationalId } from 'kennitala'
import * as styles from './styles.css'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { getValueViaPath, hasYes } from '@island.is/application/core'

export const EstateMemberRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers>>
> = ({ application, field, errors }) => {
  const error = (errors as Record<string, any>)?.estateMembers?.members
  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
    estate: EstateRegistrant
  }
  const { setValue } = useFormContext()

  // Watch the flag that tracks if we've already added the applicant
  const applicantAddedFlag = useWatch({
    name: 'estateMembers.applicantAdded',
    defaultValue: false,
  })

  const relations =
    externalData.relationOptions.map((relation) => ({
      value: relation,
      label: relation,
    })) || []
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray({
    name: `${id}.members`,
  })

  useEffect(() => {
    if (
      fields.length === 0 &&
      (!application.answers.estateMembers ||
        !application.answers.estateMembers?.encountered) &&
      externalData.estate.estateMembers
    ) {
      append(getValueViaPath(externalData, 'estate.estateMembers'))
      setValue('estateMembers.encountered', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Add currently logged in user if they don't exist in the array
    // Only runs if the applicantAddedFlag is false (meaning we haven't tried to add them yet)
    // and only if the checkbox is checked (addApplicantToEstateMembers contains YES)
    const shouldAddApplicant = hasYes(
      application.answers.addApplicantToEstateMembers as string[],
    )

    if (
      fields.length > 0 &&
      application.applicant &&
      !applicantAddedFlag &&
      shouldAddApplicant
    ) {
      const applicantExists = fields.some(
        (member: EstateMemberField) =>
          member.nationalId === application.applicant,
      )

      if (!applicantExists) {
        const nationalRegistryData = application.externalData?.nationalRegistry
          ?.data as { fullName?: string } | undefined

        append({
          nationalId: application.applicant,
          initial: false,
          name: nationalRegistryData?.fullName || '',
          relation: (application.answers.applicantRelation as string) || '',
        })
      }
    }
    // Set the flag to true so we never try to add them again
    // This persists even if they remove themselves from the list
    if (fields.length > 0 && application.applicant && !applicantAddedFlag) {
      setValue('estateMembers.applicantAdded', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, applicantAddedFlag])

  const handleAddMember = () =>
    append({
      nationalId: '',
      initial: false,
      name: '',
    })

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, member: EstateMemberField, index) => {
          if (member.nationalId === application.applicant) {
            if (application.answers.applicantRelation !== member.relation) {
              member.relation = application.answers.applicantRelation
            }
          }
          if (!member.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={index}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                title={member.name}
                description={[
                  formatNationalId(member.nationalId || ''),
                  member.relation || '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon="trash"
                      size="small"
                      iconType="outline"
                      onClick={() => remove(index)}
                    >
                      {formatMessage(m.inheritanceRemoveMember)}
                    </Button>
                  </Box>,
                ]}
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((member: EstateMemberField, index) => {
        const hidden = member.initial || member?.dummy

        // ^ Do we need to hide initial and dummy members rather than just not rendering them?
        // if (member.initial || member?.dummy) {
        //   return null
        // }

        return (
          <Box key={member.id} hidden={hidden}>
            <Item
              field={member}
              fieldName={`${id}.members`}
              index={index}
              relationOptions={relations}
              remove={remove}
              error={error && error[index] ? error[index] : null}
            />
          </Box>
        )
      })}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddMember}
          size="small"
        >
          {formatMessage(m.inheritanceAddMember)}
        </Button>
      </Box>
    </Box>
  )
}

const Item = ({
  field,
  index,
  remove,
  fieldName,
  relationOptions,
  error,
}: {
  field: EstateMemberField
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  error: Record<string, any> | null
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const relationField = `${fieldIndex}.relation`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const dummyField = `${fieldIndex}.dummy`
  const nationalIdInput = useWatch({ name: nationalIdField, defaultValue: '' })
  const name = useWatch({ name: nameField, defaultValue: '' })
  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: hasYes(field.foreignCitizenship) ? ['yes'] : '',
  })

  const { control, setValue } = useFormContext()

  const [getIdentity, { loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
      onCompleted: (data) => {
        setValue(nameField, data.identity?.name ?? '')
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [getIdentity, name, nameField, nationalIdInput, setValue])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={dummyField}
        control={control}
        defaultValue={field.dummy || false}
        render={() => <input type="hidden" />}
      />
      <Box position="absolute" className={styles.removeFieldButton}>
        <Button
          variant="ghost"
          size="small"
          circle
          icon="remove"
          onClick={() => {
            remove(index)
          }}
        />
      </Box>
      <GridRow>
        {foreignCitizenship[0] !== 'yes' ? (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nationalIdField}
                id={nationalIdField}
                name={nationalIdField}
                label={formatMessage(m.inheritanceKtLabel)}
                defaultValue={field.nationalId}
                format="######-####"
                required
                backgroundColor="blue"
                loading={queryLoading}
                error={
                  queryError
                    ? formatMessage(m.errorNationalIdIncorrect)
                    : undefined
                }
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
                key={relationField}
                id={relationField}
                name={relationField}
                label={formatMessage(m.inheritanceRelationLabel)}
                defaultValue={field.relation}
                options={relationOptions}
                backgroundColor="blue"
                error={error?.relation ?? undefined}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nameField}
                id={nameField}
                name={nameField}
                defaultValue={field.name}
                label={formatMessage(m.inheritanceNameLabel)}
                error={error?.name ?? undefined}
                readOnly
              />
            </GridColumn>
          </>
        ) : (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nameField}
                id={nameField}
                name={nameField}
                backgroundColor="blue"
                defaultValue={field.name}
                error={error?.name ?? undefined}
                label={formatMessage(m.inheritanceNameLabel)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
                key={relationField}
                id={relationField}
                name={relationField}
                label={formatMessage(m.inheritanceRelationLabel)}
                defaultValue={field.relation}
                options={relationOptions}
                error={error?.relation ?? undefined}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <DatePickerController
                label={formatMessage(m.inheritanceDayOfBirthLabel)}
                placeholder={formatMessage(m.inheritanceDayOfBirthLabel)}
                id={dateOfBirthField}
                key={dateOfBirthField}
                name={dateOfBirthField}
                locale="is"
                maxDate={new Date()}
                backgroundColor="white"
                onChange={(d) => {
                  setValue(dateOfBirthField, d)
                }}
                error={error?.dateOfBirth ?? undefined}
              />
            </GridColumn>
          </>
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
                  label: formatMessage(m.inheritanceForeignCitizenshipLabel),
                  value: 'yes',
                },
              ]}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
