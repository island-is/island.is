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
import {
  Answers,
  EstateMember,
  EstateTypes,
  heirAgeValidation,
  relationWithApplicant,
} from '../../types'
import { AdditionalEstateMember } from './AdditionalEstateMember'
import { getValueViaPath } from '@island.is/application/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { format as formatNationalId } from 'kennitala'
import intervalToDuration from 'date-fns/intervalToDuration'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'

type RepeaterProps = {
  field: {
    props: {
      repeaterButtonText: string
      sumField: string
      customFields: {
        sectionTitle?: string
        title: string
        id: string
        readOnly: true
        currency: true
      }[]
    }
  }
}

function setIfValueIsNotNan(
  setValue: (id: string, value: string | number) => void,
  fieldId: string,
  value: string | number,
) {
  if (typeof value === 'number' && isNaN(value)) {
    return
  }
  setValue(fieldId, value)
}

export const HeirsAndPartitionRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors, setBeforeSubmitCallback }) => {
  console.log('application', application)
  console.log('errors', errors)

  const { answers } = application
  const { id, props } = field
  const { customFields } = props

  const { formatMessage } = useLocale()
  const { getValues, setError, setValue } = useFormContext()
  const { fields, append, update, replace } = useFieldArray({
    name: id,
  })

  const values = getValues()
  const selectedEstate = application.answers.selectedEstate
  const taxFreeLimit = Number(
    formatMessage(m.taxFreeLimit).replace(/[^0-9]/, ''),
  )

  const [index, setIndex] = useState('0')
  const [percentage, setPercentage] = useState(0)
  const [taxFreeInheritance, setTaxFreeInheritance] = useState(0)
  const [inheritance, setInheritance] = useState(0)
  const [taxableInheritance, setTaxableInheritance] = useState(0)
  const [inheritanceTax, setInheritanceTax] = useState(0)

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

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (
        hasEstateMemberUnder18withoutRep &&
        selectedEstate !== EstateTypes.divisionOfEstateByHeirs
      ) {
        setError(heirAgeValidation, {
          type: 'custom',
        })
        return [false, 'invalid advocate age']
      }

      if (
        hasEstateMemberUnder18 &&
        selectedEstate === EstateTypes.divisionOfEstateByHeirs
      ) {
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

  // const relationsWithApplicant = relationWithApplicant.map((relation) => ({
  //   value: relation,
  //   label: relation,
  // }))

  const relations =
    externalData.relationOptions?.map((relation) => ({
      value: relation,
      label: relation,
    })) || []

  const error = (errors as any)?.heirs?.data ?? {}

  const handleAddMember = () =>
    append({
      nationalId: undefined,
      initial: false,
      enabled: true,
      name: undefined,
    })

  useEffect(() => {
    const assetsTotal = Number(getValueViaPath(answers, 'assets.assetsTotal'))
    const debtsTotal = Number(getValueViaPath(answers, 'debts.debtsTotal'))
    const businessTotal = Number(
      getValueViaPath(answers, 'business.businessTotal'),
    )
    const totalDeduction = Number(getValueViaPath(answers, 'totalDeduction'))

    const inheritanceValue = Math.round(
      (assetsTotal - debtsTotal + businessTotal - totalDeduction) * percentage,
    )

    setTaxFreeInheritance(Math.round(taxFreeLimit * percentage))
    setInheritance(inheritanceValue)
    setTaxableInheritance(Math.round(inheritance - taxFreeInheritance))
    setInheritanceTax(Math.round(taxableInheritance * 0.1))

    setIfValueIsNotNan(
      setValue,
      `${index}.taxFreeInheritance`,
      taxFreeInheritance,
    )
    setIfValueIsNotNan(setValue, `${index}.inheritance`, inheritance)
    setIfValueIsNotNan(
      setValue,
      `${index}.inheritanceTax`,
      Math.round(taxableInheritance * 0.01),
    )
    setIfValueIsNotNan(
      setValue,
      `${index}.taxableInheritance`,
      taxableInheritance,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    index,
    percentage,
    taxFreeInheritance,
    inheritance,
    taxableInheritance,
    inheritanceTax,
    setValue,
    answers,
  ])

  useEffect(() => {
    if (
      !hasEstateMemberUnder18 &&
      selectedEstate !== EstateTypes.divisionOfEstateByHeirs
    ) {
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

  const calculateTotal = useCallback(() => {
    const values = getValues(id)

    if (!values) {
      return
    }

    console.log('values', values)

    const total = values.reduce(
      (acc: number, current: any) =>
        current?.enabled ? Number(acc) + Number(current[props.sumField]) : acc,
      0,
    )
    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)

    setTotal(total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, id, props.sumField])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  useEffect(() => {
    if (fields.length === 0 && estateData?.estate?.estateMembers) {
      // ran into a problem with "append", as it appeared to be getting called multiple times
      // despite checking on the length of the fields
      // so now using "replace" instead, for the initial setup
      replace(estateData.estate.estateMembers)
    }
  }, [])

  const getDefaults = (fieldId: string) => {
    return fieldId === 'taxFreeInheritance'
      ? taxFreeInheritance
      : fieldId === 'inheritance'
      ? inheritance
      : fieldId === 'taxableInheritance'
      ? taxableInheritance
      : fieldId === 'inheritanceTax'
      ? inheritanceTax
      : ''
  }

  return (
    <Box>
      {fields.reduce((acc, member: GenericFormField<EstateMember>, index) => {
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

        const fieldIndex = `${id}[${index}]`

        return [
          ...acc,
          <Box marginTop={index > 0 ? 7 : 0} key={index}>
            <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
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
                    update(index, updatedMember)
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
                  // readOnly
                  disabled={!member.enabled}
                  format={'######-####'}
                  error={error && error[index] && error[index].nationalId}
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
              {/* <GridColumn span={['1/1']} paddingBottom={2}>
                <InputController
                  id={`${fieldIndex}.relation`}
                  name={`${fieldIndex}.relation`}
                  label={formatMessage(m.inheritanceRelationLabel)}
                  readOnly
                  defaultValue={member.relation}
                  backgroundColor="white"
                  disabled={!member.enabled}
                />
              </GridColumn> */}
              {/* {application.answers.selectedEstate ===
                EstateTypes.permitForUndividedEstate &&
                member.relation !== 'Maki' && (
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <SelectController
                      id={`${fieldIndex}.relationWithApplicant`}
                      name={`${fieldIndex}.relationWithApplicant`}
                      label={formatMessage(
                        m.inheritanceRelationWithApplicantLabel,
                      )}
                      defaultValue={member.relationWithApplicant}
                      options={relations}
                      error={error?.relationWithApplicant}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      required
                    />
                  </GridColumn>
                )} */}
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
                      error={error && error[index] && error[index].email}
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
                      error={error && error[index] && error[index].phone}
                      required
                    />
                  </GridColumn>
                </>
              )}
              {customFields.map((customField, customFieldIndex) => {
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
                      <Fragment>
                        {member.initial && (
                          <GridColumn span="1/1" paddingBottom={2}>
                            <InputController
                              id={`${fieldIndex}.${customField.id}`}
                              name={`${fieldIndex}.${customField.id}`}
                              label={customField?.title}
                              readOnly
                              defaultValue={member.relation}
                              backgroundColor="blue"
                              disabled={!member.enabled}
                            />
                          </GridColumn>
                        )}
                        {application.answers.selectedEstate ===
                          EstateTypes.permitForUndividedEstate &&
                          member.relation !== 'Maki' && (
                            <GridColumn span="1/1" paddingBottom={2}>
                              <SelectController
                                id={`${fieldIndex}.relationWithApplicant`}
                                name={`${fieldIndex}.relationWithApplicant`}
                                label={formatMessage(
                                  m.inheritanceRelationWithApplicantLabel,
                                )}
                                defaultValue={member.relationWithApplicant}
                                options={relations}
                                error={error?.relationWithApplicant}
                                backgroundColor="blue"
                                disabled={!member.enabled}
                                required
                              />
                            </GridColumn>
                          )}
                      </Fragment>
                    ) : (
                      <GridColumn span={['1/2']} paddingBottom={2}>
                        <InputController
                          id={`${fieldIndex}.${customField.id}`}
                          name={`${fieldIndex}.${customField.id}`}
                          // defaultValue={'0'}
                          defaultValue={
                            getValues(`${fieldIndex}.${customField.id}`)
                              ? getValues(`${fieldIndex}.${customField.id}`)
                              : getDefaults(customField.id)
                          }
                          disabled={!member.enabled}
                          // format={field.format}
                          label={customField.title}
                          // placeholder={field.placeholder}
                          // backgroundColor={field.color ? field.color : 'blue'}
                          currency={customField?.currency}
                          readOnly={customField?.readOnly}
                          // type={field.type}
                          // textarea={field.variant}
                          // rows={field.rows}
                          // required={field.required}
                          error={
                            error && error[index]
                              ? error[index][field.id]
                              : undefined
                          }
                          onChange={(elem) => {
                            const value = elem.target.value.replace(/\D/g, '')

                            // heirs
                            console.log('customField.id', customField.id)
                            if (customField.id === 'heirsPercentage') {
                              console.log('setting percentage...')
                              setPercentage(Number(value) / 100)
                            }

                            if (props.sumField === customField.id) {
                              calculateTotal()
                            }

                            setIndex(fieldIndex)
                          }}
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
                        error && error[index] && error[index].advocate?.phone
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
                        error && error[index] && error[index].advocate?.email
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
      }, [] as JSX.Element[])}
      {/* {fields.map((member: GenericFormField<EstateMember>, index) => {
        return (
          <Box key={member.id} hidden={member.initial}>
            <AdditionalEstateMember
              application={application}
              field={member}
              fieldName={id}
              index={index}
              relationOptions={relations}
              relationWithApplicantOptions={relationsWithApplicant}
              remove={remove}
              error={error && error[index] ? error[index] : null}
            />
          </Box>
        )
      })} */}

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
            errorMessage={
              selectedEstate === EstateTypes.divisionOfEstateByHeirs
                ? formatMessage(m.inheritanceAgeValidation)
                : formatMessage(m.heirAdvocateAgeValidation)
            }
          />
        </Box>
      ) : null}
      {!!fields.length && props.sumField && (
        <Box marginTop={5}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
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
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default HeirsAndPartitionRepeater
