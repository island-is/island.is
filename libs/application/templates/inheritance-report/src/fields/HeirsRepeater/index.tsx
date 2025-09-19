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
import { formatCurrency } from '@island.is/application/ui-components'
import { Answers, EstateMember, heirAgeValidation } from '../../types'
import { AdditionalHeir } from './AdditionalHeir'
import { getValueViaPath } from '@island.is/application/core'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { format as formatNationalId, info } from 'kennitala'
import intervalToDuration from 'date-fns/intervalToDuration'
import {
  formatPhoneNumber,
  getEstateDataFromApplication,
  getPrePaidTotalValueFromApplication,
  valueToNumber,
} from '../../lib/utils/helpers'
import { HeirsRepeaterProps } from './types'
import {
  DEFAULT_TAX_FREE_LIMIT,
  PREPAID_INHERITANCE,
  PrePaidHeirsRelations,
  RelationCharity,
  RelationSpouse,
} from '../../lib/constants'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import ShareInput from '../../components/ShareInput'
import { InheritanceReportInfo } from '@island.is/clients/syslumenn'
import {
  integerPercentageSplit,
  isEqualWithTolerance,
} from '../../lib/utils/integerSplit'

export const HeirsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & HeirsRepeaterProps>
> = ({ application, field, errors, setBeforeSubmitCallback }) => {
  const { answers } = application
  const { id, props } = field
  const { customFields } = props

  const { formatMessage } = useLocale()
  const { getValues, setError, setValue, clearErrors } = useFormContext()
  const values = getValues()
  const { fields, append, update, remove, replace } = useFieldArray({
    name: id,
  })

  const isPrePaidApplication = answers.applicationFor === PREPAID_INHERITANCE

  const heirsRelations = (values?.heirs?.data ?? []).map((x: EstateMember) => {
    return x.relation
  })
  const hasEstateMemberUnder18 = values.estate?.estateMembers?.some(
    (member: EstateMember) => {
      const hasForeignCitizenship = member?.foreignCitizenship?.[0] === 'yes'
      const birthDate = member?.dateOfBirth
      const memberAge =
        hasForeignCitizenship && birthDate
          ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
              ?.years
          : info(member.nationalId)?.age
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
        member.advocate && info(member.advocate.nationalId)?.age
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

  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
    inheritanceReportInfos: Array<InheritanceReportInfo>
  }

  const estateData = isPrePaidApplication
    ? undefined
    : getEstateDataFromApplication(application)

  const inheritanceTaxFreeLimit = isPrePaidApplication
    ? 0
    : externalData?.inheritanceReportInfos?.[0]?.inheritanceTax
        ?.taxExemptionLimit ?? DEFAULT_TAX_FREE_LIMIT

  const relations = isPrePaidApplication
    ? PrePaidHeirsRelations.map((relation) => ({
        value: formatMessage(relation.label),
        label: formatMessage(relation.label),
      }))
    : externalData?.relationOptions?.map((relation) => ({
        value: relation,
        label: relation,
      })) || []

  const error =
    ((errors as any)?.heirs?.data || (errors as any)?.heirs?.total) ?? []

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

  const calculateTotal = useCallback(() => {
    const values = getValues(id)

    if (!values) {
      return
    }

    let total = values.reduce((acc: number, current: any) => {
      const val = parseFloat(current[props.sumField])

      return current?.enabled ? acc + (isNaN(val) ? 0 : val) : acc
    }, 0)
    if (isEqualWithTolerance(total, 100)) {
      total = 100
    } else {
      total = parseFloat(total.toFixed(6))
    }

    const addTotal = id.replace('data', 'total')

    setValue(addTotal, total)
    setTotal(total)
  }, [getValues, id, props.sumField, setValue])

  const updateValues = useCallback(
    (updateIndex: string, value: number, index?: number) => {
      const numValue = isNaN(value) ? 0 : value
      const percentage = numValue > 0 ? numValue / 100 : 0
      const heirs = getValues()?.heirs?.data as EstateMember[]
      let currentHeir = isPrePaidApplication
        ? heirs[index ?? 0]
        : (getValueViaPath(answers, updateIndex) as EstateMember)

      if (!currentHeir && typeof index === 'number') {
        // if no current heir then it has not been saved yet, so let's
        // get the current heir from the heirs list
        currentHeir = heirs?.[index]
      }

      const currentNationalId = valueToNumber(currentHeir?.nationalId)

      // currently we can only check if heir is spouse by relation string value...
      const spouse = (heirs ?? []).filter(
        (heir) => heir.enabled && heir.relation === RelationSpouse,
      )

      let isSpouse = false

      // it is not possible to select more than one spouse but for now we will check for it anyway
      if (spouse.length > 0) {
        if (isPrePaidApplication) {
          isSpouse = currentHeir?.relation === RelationSpouse
        } else {
          spouse.forEach((currentSpouse) => {
            isSpouse =
              valueToNumber(currentSpouse?.nationalId) === currentNationalId
          })
        }
      }

      const netPropertyForExchange = isPrePaidApplication
        ? getPrePaidTotalValueFromApplication(application)
        : valueToNumber(getValueViaPath(answers, 'netPropertyForExchange'))

      const heirPercentages = heirs.map((h) => {
        return parseFloat(h.heirsPercentage ?? '0')
      })

      let inheritanceValue
      const roughlySumsTo100 = isEqualWithTolerance(
        heirPercentages.reduceRight((p, c) => p + c),
        100,
      )
      if (roughlySumsTo100) {
        const netPropertySplit = integerPercentageSplit(
          netPropertyForExchange,
          heirPercentages,
        )
        inheritanceValue = netPropertySplit[index ?? 0]
      } else {
        inheritanceValue = netPropertyForExchange * percentage
      }

      const customSpouseSharePercentage = getValueViaPath<string>(
        answers,
        'customShare.customSpouseSharePercentage',
      )
      const withCustomPercentage =
        (100 - Number(customSpouseSharePercentage)) * 2

      const isCharity = currentHeir?.relation === RelationCharity

      // This is a complicated calculation that's difficult to reason about.
      // It's been confirmed to work to DC's standards and thus it remains
      // functionally unaltered when calculating the augmented percentageSplit
      // for heir percentages that finally add up to 100 (during user input)
      let taxFreeInheritanceValue

      if (isCharity) {
        taxFreeInheritanceValue = inheritanceValue
      } else if (isSpouse) {
        taxFreeInheritanceValue = inheritanceValue
      } else {
        const baseAmount = roughlySumsTo100
          ? integerPercentageSplit(inheritanceTaxFreeLimit, heirPercentages)[
              index ?? 0
            ]
          : inheritanceTaxFreeLimit * percentage

        taxFreeInheritanceValue = customSpouseSharePercentage
          ? (withCustomPercentage / 100) * baseAmount
          : baseAmount
      }

      const taxableInheritanceValue = inheritanceValue - taxFreeInheritanceValue

      const inheritanceTaxValue = isSpouse ? 0 : taxableInheritanceValue * 0.1

      const taxFreeInheritance = taxFreeInheritanceValue
      const taxableInheritance =
        taxableInheritanceValue < 0 ? 0 : taxableInheritanceValue

      const inheritance = inheritanceValue
      const inheritanceTax = inheritanceTaxValue < 0 ? 0 : inheritanceTaxValue

      setValue(
        `${updateIndex}.taxFreeInheritance`,
        String(Math.round(taxFreeInheritance)),
      )
      setValue(`${updateIndex}.inheritance`, String(Math.round(inheritance)))
      setValue(
        `${updateIndex}.inheritanceTax`,
        String(Math.round(inheritanceTax)),
      )
      setValue(
        `${updateIndex}.taxableInheritance`,
        String(Math.round(taxableInheritance)),
      )

      calculateTotal()
    },
    [answers, calculateTotal, getValues, inheritanceTaxFreeLimit, setValue],
  )

  const initialLoad = useCallback(() => {
    fields.forEach((field: any, mainIndex: number) => {
      const fieldIndex = `${id}[${mainIndex}]`
      const heirsPercentage = getValues(`${fieldIndex}.heirsPercentage`)
      updateValues(fieldIndex, heirsPercentage, mainIndex)
    })
  }, [fields, getValues, id, updateValues])

  useEffect(() => {
    initialLoad()
  }, [heirsRelations, initialLoad])

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
      estateData &&
      (estateData as any)?.inheritanceReportInfo?.heirs &&
      !(application.answers as any)?.heirs?.hasModified
    ) {
      const heirsData = (estateData as any)?.inheritanceReportInfo?.heirs?.map(
        (heir: any) => {
          return {
            ...heir,
            phone: heir.phone ? formatPhoneNumber(heir.phone) : '',
            initial: true,
            enabled: true,
          }
        },
      )
      // ran into a problem with "append" as it appeared to be called multiple times
      // using "replace" instead, for the initial setup
      replace(heirsData)
      setValue('heirs.hasModified', true)
    }
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
                marginBottom={2}
              >
                <Text
                  variant="h4"
                  color={member.enabled ? 'currentColor' : 'dark300'}
                >
                  {formatMessage(m.heir) + ' ' + (mainIndex + 1)}
                </Text>
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
                      clearErrors(`${fieldIndex}.heirsPercentage`)
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
                      <PhoneInputController
                        id={`${fieldIndex}.phone`}
                        name={`${fieldIndex}.phone`}
                        label={formatMessage(m.phone)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
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
                      {customField.id === 'relation' ? (
                        <GridColumn span="1/2" paddingBottom={2}>
                          <InputController
                            id={`${fieldIndex}.${customField.id}`}
                            name={`${fieldIndex}.${customField.id}`}
                            label={formatMessage(customField.title)}
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
                            label={formatMessage(customField.title)}
                            onAfterChange={(val) => {
                              updateValues(fieldIndex, val, customFieldIndex)
                            }}
                            hasError={
                              error && error[mainIndex]
                                ? !!error[mainIndex][customField.id]
                                : false
                            }
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
                            label={formatMessage(customField.title)}
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
                        {formatMessage(
                          isPrePaidApplication
                            ? m.inheritanceAdvocateLabelPrePaid
                            : m.inheritanceAdvocateLabel,
                        )}
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
                      <PhoneInputController
                        id={`${fieldIndex}.advocate.phone`}
                        name={`${fieldIndex}.advocate.phone`}
                        label={formatMessage(m.phone)}
                        backgroundColor="blue"
                        disabled={!member.enabled}
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
              error={error[index] ?? null}
              isPrepaid={isPrePaidApplication}
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
                    !!error.length &&
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

export default HeirsRepeater
