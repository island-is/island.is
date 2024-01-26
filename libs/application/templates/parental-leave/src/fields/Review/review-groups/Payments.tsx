import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
  handleServerError,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ProblemType,
  findProblemInApolloError,
} from '@island.is/shared/problem'
import { ReviewGroupProps } from './props'
import { useFormContext } from 'react-hook-form'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import {
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_LEAVE,
  YES,
} from '../../../constants'
import { coreErrorMessages } from '@island.is/application/core'
import { YesOrNo, parentalLeaveFormMessages } from '../../..'
import {
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useUnion as useUnionOptions } from '../../../hooks/useUnion'
import { usePrivatePensionFund as usePrivatePensionFundOptions } from '../../../hooks/usePrivatePensionFund'
import { usePensionFund as usePensionFundOptions } from '../../../hooks/usePensionFund'
import { getSelectOptionLabel } from '../../../lib/parentalLeaveClientUtils'

export const Payments = ({
  application,
  editable,
  groupHasNoErrors,
  hasError,
}: ReviewGroupProps) => {
  const { formatMessage, locale } = useLocale()
  const { getValues, setValue } = useFormContext()

  const [
    {
      applicationType,
      pensionFund,
      useUnion,
      union,
      usePrivatePensionFund,
      privatePensionFund,
      privatePensionFundPercentage,
      bank,
    },
    setStateful,
  ] = useStatefulAnswers(application)

  const [updateApplication] = useMutation(UPDATE_APPLICATION, {
    onError: (e) => {
      // We handle validation problems separately.
      const problem = findProblemInApolloError(e)
      if (problem?.type === ProblemType.VALIDATION_FAILED) {
        return
      }

      return handleServerError(e, formatMessage)
    },
  })

  const pensionFundOptions = usePensionFundOptions()
  const privatePensionFundOptions = usePrivatePensionFundOptions().filter(
    ({ value }) => value !== NO_PRIVATE_PENSION_FUND,
  )
  const unionOptions = useUnionOptions().filter(
    ({ value }) => value !== NO_UNION,
  )

  const saveApplication = async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            ...getValues(),
          },
        },
        locale,
      },
    })
  }

  const validateUnion = () => {
    if (useUnion !== YES) return undefined

    if (union === '') {
      return formatMessage(coreErrorMessages.defaultError)
    }

    return undefined
  }

  const validatePrivatePensionFund = () => {
    if (usePrivatePensionFund !== YES) return undefined

    if (privatePensionFund === '') {
      return formatMessage(coreErrorMessages.defaultError)
    }

    return undefined
  }

  const validatePrivatePensionFundPercentage = () => {
    if (usePrivatePensionFund !== YES) return undefined

    if (privatePensionFundPercentage === '0') {
      return formatMessage(coreErrorMessages.defaultError)
    }

    return undefined
  }

  const checkPaymentErrors = (ids: string[]) => {
    if (typeof validatePrivatePensionFund() === 'string') return false
    else if (typeof validatePrivatePensionFundPercentage() === 'string')
      return false
    else if (typeof validateUnion() === 'string') return false

    return groupHasNoErrors(ids)
  }

  return (
    <ReviewGroup
      saveAction={saveApplication}
      isEditable={editable}
      canCloseEdit={checkPaymentErrors([
        'payments.bank',
        'payments.pensionFund',
        'payments.useUnion',
        'payments.union',
        'payments.usePrivatePensionFund',
        'payments.privatePensionFund',
        'payments.privatePensionFundPercentage',
      ])}
      editChildren={
        <Stack space={3}>
          <Label>
            {formatMessage(
              parentalLeaveFormMessages.shared.paymentInformationSubSection,
            )}
          </Label>

          <InputController
            id="payments.bank"
            name="payments.bank"
            format="####-##-######"
            placeholder="0000-00-000000"
            defaultValue={bank}
            label={formatMessage(
              parentalLeaveFormMessages.shared.paymentInformationBank,
            )}
            onChange={(e) =>
              setStateful((prev) => ({ ...prev, bank: e.target.value }))
            }
            error={hasError('payments.bank')}
          />
          {applicationType === PARENTAL_LEAVE && (
            <>
              <SelectController
                label={formatMessage(
                  parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                )}
                name="payments.pensionFund"
                id="payments.pensionFund"
                options={pensionFundOptions}
                defaultValue={pensionFund}
                onSelect={(s) =>
                  setStateful((prev) => ({
                    ...prev,
                    pensionFund: s.value as string,
                  }))
                }
                error={hasError('payments.pensionFund')}
              />
              <Label>
                {formatMessage(parentalLeaveFormMessages.shared.unionName)}
              </Label>
              <Stack space={1}>
                <RadioController
                  id="payments.useUnion"
                  name="payments.useUnion"
                  defaultValue={useUnion}
                  split="1/2"
                  options={[
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.yesOptionLabel,
                      ),
                      value: YES,
                    },
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.noOptionLabel,
                      ),
                      value: NO,
                    },
                  ]}
                  onSelect={(s: string) => {
                    setStateful((prev) => {
                      const union = s === NO ? NO_UNION : ''
                      setValue('payments.union', union)
                      return {
                        ...prev,
                        union,
                        useUnion: s as YesOrNo,
                      }
                    })
                  }}
                  error={hasError('useUnion')}
                />

                {useUnion === YES && (
                  <SelectController
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.union,
                    )}
                    name="payments.union"
                    id="payments.union"
                    options={unionOptions}
                    defaultValue={union}
                    onSelect={(s) => {
                      setStateful((prev) => ({
                        ...prev,
                        union: s.value as string,
                      }))
                    }}
                    error={validateUnion()}
                  />
                )}
              </Stack>
              <Label>
                {formatMessage(
                  parentalLeaveFormMessages.shared.privatePensionFundName,
                )}
              </Label>
              <Stack space={1}>
                <RadioController
                  id="payments.usePrivatePensionFund"
                  name="payments.usePrivatePensionFund"
                  defaultValue={usePrivatePensionFund}
                  split="1/2"
                  options={[
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.yesOptionLabel,
                      ),
                      value: YES,
                    },
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.noOptionLabel,
                      ),
                      value: NO,
                    },
                  ]}
                  onSelect={(s: string) => {
                    setStateful((prev) => {
                      const privatePensionFund =
                        s === NO ? NO_PRIVATE_PENSION_FUND : ''
                      const privatePensionFundPercentage =
                        s === NO ? '0' : prev.privatePensionFundPercentage
                      setValue(
                        'payments.privatePensionFund',
                        privatePensionFund,
                      )
                      setValue(
                        'payments.privatePensionFundPercentage',
                        privatePensionFundPercentage,
                      )
                      return {
                        ...prev,
                        privatePensionFund,
                        privatePensionFundPercentage,
                        usePrivatePensionFund: s as YesOrNo,
                      }
                    })
                  }}
                  error={hasError('payments.usePrivatePensionFund')}
                />

                {usePrivatePensionFund === YES && (
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                      <SelectController
                        label={formatMessage(
                          parentalLeaveFormMessages.shared.privatePensionFund,
                        )}
                        name="payments.privatePensionFund"
                        id="payments.privatePensionFund"
                        options={privatePensionFundOptions}
                        defaultValue={privatePensionFund}
                        onSelect={(s) =>
                          setStateful((prev) => ({
                            ...prev,
                            privatePensionFund: s.value as string,
                          }))
                        }
                        error={validatePrivatePensionFund()}
                      />
                    </GridColumn>

                    <GridColumn
                      paddingTop={[2, 2, 2, 0]}
                      span={['12/12', '12/12', '12/12', '6/12']}
                    >
                      <SelectController
                        label={formatMessage(
                          parentalLeaveFormMessages.shared
                            .privatePensionFundRatio,
                        )}
                        name="payments.privatePensionFundPercentage"
                        id="payments.privatePensionFundPercentage"
                        defaultValue={privatePensionFundPercentage}
                        options={[
                          { label: '2%', value: '2' },
                          { label: '4%', value: '4' },
                        ]}
                        onSelect={(s) =>
                          setStateful((prev) => ({
                            ...prev,
                            privatePensionFundPercentage: s.value as string,
                          }))
                        }
                        error={validatePrivatePensionFundPercentage()}
                      />
                    </GridColumn>
                  </GridRow>
                )}
              </Stack>
            </>
          )}
        </Stack>
      }
      triggerValidation
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationBank,
              )}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
        {applicationType === PARENTAL_LEAVE && (
          <>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                  )}
                  value={getSelectOptionLabel(pensionFundOptions, pensionFund)}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.unionName,
                  )}
                  value={useUnion}
                />
              </GridColumn>
            </GridRow>

            {useUnion === YES && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.union,
                    )}
                    value={getSelectOptionLabel(unionOptions, union)}
                  />
                </GridColumn>
              </GridRow>
            )}

            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  )}
                  value={usePrivatePensionFund}
                />
              </GridColumn>
            </GridRow>

            {usePrivatePensionFund === YES && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFund,
                    )}
                    value={getSelectOptionLabel(
                      privatePensionFundOptions,
                      privatePensionFund,
                    )}
                  />
                </GridColumn>

                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFundRatio,
                    )}
                    value={privatePensionFundPercentage}
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
