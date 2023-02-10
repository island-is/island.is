import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import get from 'lodash/get'
import has from 'lodash/has'

import { format as formatKennitala } from 'kennitala'
import { coreErrorMessages } from '@island.is/application/core'
import { Application, RecordObject, Field } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import {
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  DataValue,
  formatBankInfo,
  formatPhoneNumber,
  handleServerError,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'

import {
  getSelectedChild,
  requiresOtherParentApproval,
  getApplicationExternalData,
  getOtherParentId,
  getOtherParentName,
  formatPeriods,
  getLastDayOfLastMonth,
} from '../../lib/parentalLeaveUtils'
// TODO: Bring back payment calculation info, once we have an api
// import PaymentsTable from '../PaymentSchedule/PaymentsTable'
// import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import {
  YES,
  NO,
  MANUAL,
  SPOUSE,
  ParentalRelations,
  NO_UNION,
  NO_PRIVATE_PENSION_FUND,
  PARENTAL_LEAVE,
  SINGLE,
} from '../../constants'
import { YesOrNo } from '../../types'
import { SummaryTimeline } from '../components/SummaryTimeline/SummaryTimeline'
import { SummaryRights } from '../Rights/SummaryRights'
import { useUnion as useUnionOptions } from '../../hooks/useUnion'
import { usePrivatePensionFund as usePrivatePensionFundOptions } from '../../hooks/usePrivatePensionFund'
import { usePensionFund as usePensionFundOptions } from '../../hooks/usePensionFund'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'
import { getSelectOptionLabel } from '../../lib/parentalLeaveClientUtils'

import * as styles from './Review.css'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const pensionFundOptions = usePensionFundOptions()
  const privatePensionFundOptions = usePrivatePensionFundOptions().filter(
    ({ value }) => value !== NO_PRIVATE_PENSION_FUND,
  )
  const unionOptions = useUnionOptions().filter(
    ({ value }) => value !== NO_UNION,
  )
  const { locale, formatMessage } = useLocale()
  const [
    {
      applicationType,
      applicantEmail,
      applicantPhoneNumber,
      otherParent,
      otherParentEmail,
      otherParentPhoneNumber,
      pensionFund,
      useUnion,
      union,
      usePrivatePensionFund,
      privatePensionFund,
      privatePensionFundPercentage,
      isSelfEmployed,
      bank,
      usePersonalAllowance,
      usePersonalAllowanceFromSpouse,
      personalUseAsMuchAsPossible,
      personalUsage,
      spouseUseAsMuchAsPossible,
      spouseUsage,
      employerEmail,
      employerPhoneNumber,
      isRecivingUnemploymentBenefits,
      unemploymentBenefits,
    },
    setStateful,
  ] = useStatefulAnswers(application)
  const { getValues, setValue } = useFormContext()

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

  const otherParentName = getOtherParentName(application)
  const otherParentId = getOtherParentId(application)

  const { applicantName, applicationFundId } = getApplicationExternalData(
    application.externalData,
  )
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const hasSelectedOtherParent =
    otherParent !== NO && otherParent !== SINGLE && otherParent !== MANUAL

  const otherParentWillApprove = requiresOtherParentApproval(
    application.answers,
    application.externalData,
  )

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

  const hasError = (id: string) => get(errors, id) as string

  const checkPaymentErrors = (ids: string[]) => {
    if (typeof validatePrivatePensionFund() === 'string') return false
    else if (typeof validatePrivatePensionFundPercentage() === 'string')
      return false
    else if (typeof validateUnion() === 'string') return false

    return groupHasNoErrors(ids)
  }

  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

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

  const periods = formatPeriods(application, formatMessage)

  return (
    <>
      <Box className={styles.printButton} position="absolute">
        <Button
          variant="utility"
          icon="print"
          onClick={(e) => {
            e.preventDefault()
            window.print()
          }}
        />
      </Box>
      <ReviewGroup
        isEditable={editable}
        canCloseEdit={groupHasNoErrors([
          'applicant.email',
          'applicant.phoneNumber',
        ])}
        editChildren={
          <Box marginTop={[8, 8, 8, 0]}>
            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '12/12', '6/12']}
                paddingBottom={3}
              >
                <InputController
                  id="applicant.email"
                  name="applicant.email"
                  defaultValue={applicantEmail}
                  type="email"
                  label={formatMessage(
                    parentalLeaveFormMessages.applicant.email,
                  )}
                  onChange={(e) =>
                    setStateful((prev) => ({
                      ...prev,
                      applicantEmail: e.target.value,
                    }))
                  }
                  error={hasError('applicant.email')}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                <InputController
                  id="applicant.phoneNumber"
                  name="applicant.phoneNumber"
                  defaultValue={applicantPhoneNumber}
                  type="tel"
                  format="###-####"
                  placeholder="000-0000"
                  label={formatMessage(
                    parentalLeaveFormMessages.applicant.phoneNumber,
                  )}
                  onChange={(e) =>
                    setStateful((prev) => ({
                      ...prev,
                      applicantPhoneNumber: e.target.value,
                    }))
                  }
                  error={hasError('applicant.phoneNumber')}
                />
              </GridColumn>
            </GridRow>
          </Box>
        }
        triggerValidation
      >
        {applicantName !== '' && (
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.fullName,
                )}
                value={applicantName}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.nationalId,
                )}
                value={formatKennitala(application.applicant)}
              />
            </GridColumn>
          </GridRow>
        )}

        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(parentalLeaveFormMessages.applicant.email)}
              value={applicantEmail}
              error={hasError('applicant.email')}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.applicant.phoneNumber,
              )}
              value={formatPhoneNumber(applicantPhoneNumber)}
              error={hasError('applicant.phoneNumber')}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      {otherParent && (
        <ReviewGroup
          isEditable={editable && isPrimaryParent}
          editAction={() => goToScreen?.('otherParentObj')}
        >
          {(otherParent === NO || otherParent === SINGLE) && (
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentTitle,
              )}
              value={NO}
            />
          )}

          {otherParent === SPOUSE && (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentName,
                  )}
                  value={otherParentName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentID,
                  )}
                  value={formatKennitala(otherParentId!)}
                />
              </GridColumn>
            </GridRow>
          )}

          {otherParent === MANUAL && (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentName,
                  )}
                  value={otherParentName}
                />
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentID,
                  )}
                  value={
                    otherParentId
                      ? formatKennitala(otherParentId)
                      : otherParentId
                  }
                />
              </GridColumn>
            </GridRow>
          )}
          {otherParentWillApprove && (
            <GridRow marginTop={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentEmailSubSection,
                  )}
                  value={otherParentEmail}
                />
              </GridColumn>
              {otherParentPhoneNumber && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared
                        .otherParentPhoneNumberSubSection,
                    )}
                    value={formatPhoneNumber(otherParentPhoneNumber)}
                  />
                </GridColumn>
              )}
            </GridRow>
          )}
        </ReviewGroup>
      )}

      <ReviewGroup
        saveAction={saveApplication}
        isEditable={editable}
        canCloseEdit={checkPaymentErrors([
          'payments.bank',
          'payments.pensionFund',
          'useUnion',
          'payments.union',
          'usePrivatePensionFund',
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
                    id="useUnion"
                    name="useUnion"
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
                    id="usePrivatePensionFund"
                    name="usePrivatePensionFund"
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
                    error={hasError('usePrivatePensionFund')}
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
                    value={getSelectOptionLabel(
                      pensionFundOptions,
                      pensionFund,
                    )}
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
                        parentalLeaveFormMessages.shared
                          .privatePensionFundRatio,
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

      <ReviewGroup
        isEditable={editable}
        editAction={() => goToScreen?.('personalAllowance')}
      >
        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.title,
              )}
              value={usePersonalAllowance}
            />
          </GridColumn>

          {usePersonalAllowance === YES && personalUseAsMuchAsPossible === YES && (
            <GridColumn
              paddingTop={[2, 2, 2, 0]}
              span={['12/12', '12/12', '12/12', '5/12']}
            >
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.reviewScreen.usePersonalAllowance,
                )}
                value={personalUseAsMuchAsPossible}
              />
            </GridColumn>
          )}

          {usePersonalAllowance === YES && personalUseAsMuchAsPossible === NO && (
            <GridColumn
              paddingTop={[2, 2, 2, 0]}
              span={['12/12', '12/12', '12/12', '5/12']}
            >
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                )}
                value={`${personalUsage ?? 0}%`}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>

      {isPrimaryParent && hasSelectedOtherParent && (
        <ReviewGroup
          isEditable={editable}
          editAction={() => goToScreen?.('personalAllowanceFromSpouse')}
        >
          <GridRow marginBottom={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.personalAllowance.spouseTitle,
                )}
                value={usePersonalAllowanceFromSpouse}
              />
            </GridColumn>

            {usePersonalAllowanceFromSpouse === YES &&
              spouseUseAsMuchAsPossible === YES && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <RadioValue
                    label={formatMessage(
                      parentalLeaveFormMessages.reviewScreen
                        .useSpousePersonalAllowance,
                    )}
                    value={spouseUseAsMuchAsPossible}
                  />
                </GridColumn>
              )}

            {usePersonalAllowanceFromSpouse === YES &&
              spouseUseAsMuchAsPossible === NO && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.personalAllowance
                        .allowanceUsage,
                    )}
                    value={`${spouseUsage ?? 0}%`}
                  />
                </GridColumn>
              )}
          </GridRow>
        </ReviewGroup>
      )}

      {applicationType === PARENTAL_LEAVE && (
        <ReviewGroup
          isEditable={editable}
          editAction={() => goToScreen?.('employer.isSelfEmployed.benefits')}
        >
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.selfEmployed.title,
                )}
                value={isSelfEmployed}
              />
              {isSelfEmployed === NO &&
                isRecivingUnemploymentBenefits === NO &&
                employerPhoneNumber && (
                  <Box paddingTop={2}>
                    <DataValue
                      label={formatMessage(
                        parentalLeaveFormMessages.employer.phoneNumber,
                      )}
                      value={formatPhoneNumber(employerPhoneNumber)}
                    />
                  </Box>
                )}
            </GridColumn>

            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              {isSelfEmployed === NO &&
                isRecivingUnemploymentBenefits === NO && (
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.employer.email,
                    )}
                    value={employerEmail}
                  />
                )}
            </GridColumn>
          </GridRow>
          {isSelfEmployed === NO && ( // only show benefits in review if user had to answer that question
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.employer
                      .isRecivingUnemploymentBenefitsTitle,
                  )}
                  value={isRecivingUnemploymentBenefits}
                />
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                {isRecivingUnemploymentBenefits === YES && (
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.employer.unemploymentBenefits,
                    )}
                    value={unemploymentBenefits}
                  />
                )}
              </GridColumn>
            </GridRow>
          )}
        </ReviewGroup>
      )}

      <ReviewGroup>
        <SummaryRights application={application} />
      </ReviewGroup>
      <ReviewGroup
        isEditable={editable}
        editAction={() => goToScreen?.('periods')}
        isLast={true}
      >
        <SummaryTimeline application={application} />
        {(!applicationFundId || applicationFundId === '') &&
          periods.length > 0 &&
          new Date(periods[0].startDate).getTime() <
            getLastDayOfLastMonth().getTime() && (
            <p
              style={{ color: '#B30038', fontSize: '14px', fontWeight: '500' }}
            >
              {formatMessage(errorMessages.startDateInThePast)}
            </p>
          )}
      </ReviewGroup>

      {/**
       * TODO: Bring back payment calculation info, once we have an api
       * https://app.asana.com/0/1182378413629561/1200214178491335/f
       */}
      {/* <ReviewGroup
      isEditable={editable}>
        {!loading && !error && (
          <>
            <Label>
              {formatMessage(
                parentalLeaveFormMessages.paymentPlan.subSection,
              )}
            </Label>

            <PaymentsTable
              application={application}
              payments={data.getEstimatedPayments}
            />
          </>
        )}
      </ReviewGroup> */}

      {/**
       * TODO: Bring back this feature post v1 launch
       * Would also be good to combine it with the first accordion item
       * and make just one section for the other parent info, and sharing with the other parent
       * https://app.asana.com/0/1182378413629561/1200214178491339/f
       */}
      {/* {statefulOtherParentConfirmed === MANUAL && (
        <ReviewGroup
        isEditable={editable}>
          <Box paddingY={4}>
            <Box marginTop={1} marginBottom={2}>
              <Text variant="h5">
                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.subSection,
                )}

                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.title,
                )}
              </Text>
            </Box>

            {editable ? (
              <RadioController
                id="shareInformationWithOtherParent"
                name="shareInformationWithOtherParent"
                error={
                  (errors as RecordObject<string> | undefined)
                    ?.shareInformationWithOtherParent
                }
                defaultValue={shareInformationWithOtherParent}
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
              />
            ) : (
              <RadioValue value={shareInformationWithOtherParent} />
            )}
          </Box>
        </ReviewGroup>
      )} */}
    </>
  )
}
