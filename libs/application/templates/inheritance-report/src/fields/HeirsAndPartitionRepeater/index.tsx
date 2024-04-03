/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { formatCurrency } from '@island.is/application/ui-components'
import { Answers, EstateMember, heirAgeValidation } from '../../types'
import { AdditionalHeir } from './AdditionalHeir'
import { getValueViaPath } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { format as formatNationalId } from 'kennitala'
import intervalToDuration from 'date-fns/intervalToDuration'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'
import { HeirsAndPartitionRepeaterProps } from './types'
import { TAX_FREE_LIMIT } from '../../lib/constants'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import ShareInput from '../../components/ShareInput'

export const HeirsAndPartitionRepeater: FC<
  React.PropsWithChildren<
    FieldBaseProps<Answers> & HeirsAndPartitionRepeaterProps
  >
> = ({ application, field, errors, setBeforeSubmitCallback }) => {
  const { answers } = application
  const { id, props } = field
  const { customFields } = props

  const { formatMessage } = useLocale()
  const { getValues, setError, setValue } = useFormContext()
  const { fields, append, update, remove, replace } = useFieldArray({
    name: id,
  })

  const values = getValues()

  const hasEstateMemberUnder18 = values.estate?.estateMembers?.some(
    (member: EstateMember) => {
      const hasForeignCitizenship = member?.foreignCitizenship?.[0] === 'yes'
      const birthDate = member?.dateOfBirth
      const memberAge =
        hasForeignCitizenship && birthDate
          ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
              ?.years
          : kennitala.info(member.nationalId)?.age
      return (
        (memberAge ?? 0) < 18 &&
        (member?.nationalId || birthDate) &&
        member.enabled
      )
    },
  )

  const hasEstateMemberUnder18withoutRep = values.estate?.estateMembers?.some(
    (member: EstateMember) => {
      const advocateAge =
        member.advocate && kennitala.info(member.advocate.nationalId)?.age
      return (
        hasEstateMemberUnder18 &&
        member?.advocate?.nationalId &&
        advocateAge &&
        advocateAge < 18
      )
    },
  )

  setBeforeSubmitCallback?.(async () => {
    if (hasEstateMemberUnder18withoutRep) {
      setError(heirAgeValidation, {
        type: 'custom',
      })
      return [false, 'invalid advocate age']
    }

    if (hasEstateMemberUnder18) {
      setError(heirAgeValidation, {
        type: 'custom',
      })
      return [false, 'invalid member age']
    }

    return [true, null]
  })

  const { clearErrors } = useFormContext()

  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
  }

  const estateData = getEstateDataFromApplication(application)

  const relations =
    externalData.relationOptions?.map((relation) => ({
      value: relation,
      label: relation,
    })) || []

  const error = (errors as any)?.heirs?.data ?? {}

  const handleAddMember = () =>
    append({
      nationalId: '',
      initial: false,
      enabled: true,
      name: '',
      phone: '',
      relation: '',
      email: '',
      heirsPercentage: '',
      inheritance: '',
      inheritanceTax: '',
      taxFreeInheritance: '',
      taxableInheritance: '',
      dateOfBirth: '',
      foreignCitizenship: [],
    })

  const updateValues = (updateIndex: string, value: number) => {
    const numValue = isNaN(value) ? 0 : value
    const percentage = numValue > 0 ? numValue / 100 : 0

    console.log('percentage', percentage)
    const netPropertyForExchange = Number(
      getValueViaPath(answers, 'netPropertyForExchange'),
    )
    console.log('netPropertyForExchange', netPropertyForExchange)
    const inheritanceValue = Math.round(netPropertyForExchange * percentage)

    console.log('inheritanceValue', inheritanceValue)
    const taxFreeInheritanceValue = Math.round(TAX_FREE_LIMIT * percentage)
    const taxableInheritanceValue = Math.round(
      inheritanceValue - taxFreeInheritanceValue,
    )

    const inheritanceTaxValue = Math.round(taxableInheritanceValue * 0.1)

    setValue(
      `${updateIndex}.taxFreeInheritance`,
      String(taxFreeInheritanceValue),
    )
    setValue(`${updateIndex}.inheritance`, String(inheritanceValue))
    setValue(
      `${updateIndex}.inheritanceTax`,
      String(inheritanceTaxValue < 0 ? 0 : inheritanceTaxValue),
    )
    setValue(
      `${updateIndex}.taxableInheritance`,
      String(taxableInheritanceValue < 0 ? 0 : taxableInheritanceValue),
    )

    calculateTotal()
  }

  const calculateTotal = useCallback(() => {
    const values = getValues(id)

    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any) => {
      const val = parseFloat(current[props.sumField])

      return current?.enabled ? acc + (isNaN(val) ? 0 : val) : acc
    }, 0)

    const addTotal = id.replace('data', 'total')

    setValue(addTotal, total)
    setTotal(total)
  }, [getValues, id, props.sumField, setValue])

  useEffect(() => {
    fields.forEach((field: any, mainIndex: number) => {
      const fieldIndex = `${id}[${mainIndex}]`
      const heirsPercentage = getValues(`${fieldIndex}.heirsPercentage`)
      updateValues(fieldIndex, heirsPercentage)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasEstateMemberUnder18) {
      clearErrors(heirAgeValidation)
    }
    if (!hasEstateMemberUnder18withoutRep) {
      clearErrors(heirAgeValidation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fields,
    hasEstateMemberUnder18withoutRep,
    hasEstateMemberUnder18,
    clearErrors,
  ])

  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (
      fields.length === 0 &&
      estateData?.inheritanceReportInfo?.heirs &&
      !(application.answers as any)?.heirs?.hasModified
    ) {
      // ran into a problem with "append", as it appeared to be getting called multiple times
      // despite checking on the length of the fields
      // so now using "replace" instead, for the initial setup
      replace(estateData?.inheritanceReportInfo?.heirs)
      setValue('heirs.hasModified', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      {fields.reduce(
        (acc, member: GenericFormField<EstateMember>, mainIndex) => {
          if (member.nationalId === application.applicant) {
            const relation = getValueViaPath<string>(
              application.answers,
              'applicantRelation',
            )

            if (relation && relation !== member.relation) {
              member.relation = relation
            }
          }

          if (!member.initial) {
            return acc
          }

          const fieldIndex = `${id}[${mainIndex}]`

          return [
            ...acc,
            <Box
              marginTop={mainIndex > 0 ? 7 : 0}
              key={`${mainIndex}_${member.id}`}
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                marginBottom={3}
              >
                <Text variant="h4">{formatMessage(m.heir)}</Text>
                <Box>
                  <Button
                    variant="text"
                    size="small"
                    icon={member.enabled ? 'remove' : 'add'}
                    onClick={() => {
                      const updatedMember = {
                        ...member,
                        enabled: !member.enabled,
                      }
                      update(mainIndex, updatedMember)
                      clearErrors(`${fieldIndex}.phone`)
                      clearErrors(`${fieldIndex}.email`)
                      clearErrors(`${fieldIndex}.advocate.phone`)
                      clearErrors(`${fieldIndex}.advocate.email`)
                      calculateTotal()
                    }}
                  >
                    {member.enabled
                      ? formatMessage(m.inheritanceDisableMember)
                      : formatMessage(m.inheritanceEnableMember)}
                  </Button>
                </Box>
              </Box>
              <GridRow>
                <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                  <InputController
                    id={`${fieldIndex}.nationalId`}
                    name={`${fieldIndex}.nationalId`}
                    label={formatMessage(m.inheritanceKtLabel)}
                    defaultValue={formatNationalId(member.nationalId || '')}
                    backgroundColor="white"
                    readOnly
                    disabled={!member.enabled}
                    format={'######-####'}
                    error={
                      error && error[mainIndex] && error[mainIndex].nationalId
                    }
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                  <InputController
                    id={`${fieldIndex}.name`}
                    name={`${fieldIndex}.name`}
                    label={formatMessage(m.inheritanceNameLabel)}
                    readOnly
                    defaultValue={member.name || ''}
                    backgroundColor="white"
                    disabled={!member.enabled}
                  />
                </GridColumn>
                {!member.advocate && (
                  <>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.email`}
                        name={`${fieldIndex}.email`}
                        label={formatMessage(m.email)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
                        defaultValue={member.email || ''}
                        error={
                          error && error[mainIndex] && error[mainIndex].email
                        }
                        required
                      />
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.phone`}
                        name={`${fieldIndex}.phone`}
                        label={formatMessage(m.phone)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
                        format="###-####"
                        defaultValue={member.phone || ''}
                        error={
                          error && error[mainIndex] && error[mainIndex].phone
                        }
                        required
                      />
                    </GridColumn>
                  </>
                )}
                {customFields.map((customField: any, customFieldIndex) => {
                  const defaultValue = (member as any)?.[customField.id]

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
                          <InputController
                            id={`${fieldIndex}.${customField.id}`}
                            name={`${fieldIndex}.${customField.id}`}
                            label={customField?.title}
                            readOnly
                            defaultValue={member.relation}
                            backgroundColor="white"
                            disabled={!member.enabled}
                          />
                        </GridColumn>
                      ) : customField.id === 'heirsPercentage' ? (
                        <GridColumn span="1/2" paddingBottom={2}>
                          <ShareInput
                            name={`${fieldIndex}.${customField.id}`}
                            disabled={!member.enabled}
                            label={customField.title}
                            onAfterChange={(val) => {
                              updateValues(fieldIndex, val)
                            }}
                            errorMessage={
                              error && error[mainIndex]
                                ? error[mainIndex][customField.id]
                                : undefined
                            }
                            required
                          />
                        </GridColumn>
                      ) : (
                        <GridColumn span={['1/2']} paddingBottom={2}>
                          <InputController
                            id={`${fieldIndex}.${customField.id}`}
                            name={`${fieldIndex}.${customField.id}`}
                            disabled={!member.enabled}
                            defaultValue={defaultValue ? defaultValue : ''}
                            format={customField.format}
                            label={customField.title}
                            currency
                            readOnly
                            error={
                              error && error[mainIndex]
                                ? error[mainIndex][customField.id]
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
              {member.advocate && (
                <Box
                  marginTop={2}
                  paddingY={5}
                  paddingX={7}
                  borderRadius="large"
                  border="standard"
                >
                  <GridRow>
                    <GridColumn span={['1/1']} paddingBottom={2}>
                      <Text
                        variant="h4"
                        color={member.enabled ? 'dark400' : 'dark300'}
                      >
                        {formatMessage(m.inheritanceAdvocateLabel)}
                      </Text>
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.advocate.nationalId`}
                        name={`${fieldIndex}.advocate.nationalId`}
                        label={formatMessage(m.inheritanceKtLabel)}
                        readOnly
                        defaultValue={formatNationalId(
                          member.advocate?.nationalId || '',
                        )}
                        backgroundColor="white"
                        disabled={!member.enabled}
                        format={'######-####'}
                        size="sm"
                      />
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.advocate.name`}
                        name={`${fieldIndex}.advocate.name`}
                        label={formatMessage(m.inheritanceNameLabel)}
                        readOnly
                        defaultValue={member.advocate?.name || ''}
                        backgroundColor="white"
                        disabled={!member.enabled}
                        size="sm"
                      />
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.advocate.phone`}
                        name={`${fieldIndex}.advocate.phone`}
                        label={formatMessage(m.phone)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
                        format="###-####"
                        defaultValue={member.advocate?.phone || ''}
                        error={
                          error &&
                          error[mainIndex] &&
                          error[mainIndex].advocate?.phone
                        }
                        size="sm"
                        required
                      />
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.advocate.email`}
                        name={`${fieldIndex}.advocate.email`}
                        label={formatMessage(m.email)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
                        defaultValue={member.advocate?.email || ''}
                        error={
                          error &&
                          error[mainIndex] &&
                          error[mainIndex].advocate?.email
                        }
                        size="sm"
                        required
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
              )}
            </Box>,
          ]
        },
        [] as JSX.Element[],
      )}
      {fields.map((member: GenericFormField<EstateMember>, index) => {
        if (member.initial) return null

        return (
          <Box key={member.id}>
            <AdditionalHeir
              field={member}
              fieldName={id}
              index={index}
              customFields={customFields}
              relationOptions={relations}
              updateValues={updateValues}
              remove={remove}
              error={error && error[index] ? error[index] : null}
            />
          </Box>
        )
      })}

      <Box marginTop={3}>
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
      {errors && errors[heirAgeValidation] ? (
        <Box marginTop={4}>
          <InputError
            errorMessage={formatMessage(m.inheritanceAgeValidation)}
          />
        </Box>
      ) : null}
      {!!fields.length && props.sumField && (
        <GridRow>
          <DoubleColumnRow pushRight span={['1/1', '1/2']}>
            <Box marginTop={5}>
              <Input
                id={`${id}.total`}
                name={`${id}.total`}
                value={
                  props.sumField === 'heirsPercentage'
                    ? String(total) + ' / 100%'
                    : formatCurrency(String(total))
                }
                label={
                  props.sumField === 'heirsPercentage'
                    ? formatMessage(m.totalPercentage)
                    : formatMessage(m.total)
                }
                backgroundColor="white"
                readOnly
                hasError={
                  (props.sumField === 'heirsPercentage' &&
                    error &&
                    total !== 100) ??
                  false
                }
                errorMessage={formatMessage(m.totalPercentageError)}
              />
            </Box>
          </DoubleColumnRow>
        </GridRow>
      )}
    </Box>
  )
}

export default HeirsAndPartitionRepeater
