import React, { FC, useMemo } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'

import {
  Application,
  formatAndParseAsHTML,
  buildFieldOptions,
  RecordObject,
  Field,
} from '@island.is/application/core'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import {
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'

import {
  getOtherParentOptions,
  getSelectedChild,
  requiresOtherParentApproval,
} from '../../lib/parentalLeaveUtils'
// TODO: Bring back payment calculation info, once we have an api
// import PaymentsTable from '../PaymentSchedule/PaymentsTable'
// import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO, MANUAL, ParentalRelations } from '../../constants'
import { YesOrNo } from '../../types'
import { SummaryTimeline } from '../components/SummaryTimeline/SummaryTimeline'
import { SummaryRights } from '../Rights/SummaryRights'
import { useUnion as useUnionOptions } from '../../hooks/useUnion'
import { usePrivatePensionFund as usePrivatePensionFundOptions } from '../../hooks/usePrivatePensionFund'
import { usePensionFund as usePensionFundOptions } from '../../hooks/usePensionFund'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'
import { getSelectOptionLabel } from '../../lib/parentalLeaveClientUtils'

type ValidOtherParentAnswer = typeof NO | typeof MANUAL | undefined

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
  const privatePensionFundOptions = usePrivatePensionFundOptions()
  const unionOptions = useUnionOptions()
  const { formatMessage } = useLocale()
  const [
    {
      applicantEmail,
      applicantPhoneNumber,
      otherParent,
      otherParentName,
      otherParentEmail,
      otherParentId,
      pensionFund,
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
    },
    setStateful,
  ] = useStatefulAnswers(application)
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const otherParentOptions = useMemo(
    () =>
      buildFieldOptions(getOtherParentOptions(application), application, field),
    [application],
  )

  const otherParentWillApprove = requiresOtherParentApproval(
    application.answers,
  )

  const hasError = (id: string) => get(errors, id) as string
  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  return (
    <>
      <ReviewGroup
        isEditable={editable}
        canCloseEdit={groupHasNoErrors([
          'applicant.email',
          'applicant.phoneNumber',
        ])}
        editChildren={
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="applicant.email"
                name="applicant.email"
                defaultValue={applicantEmail}
                type="email"
                label={formatMessage(parentalLeaveFormMessages.applicant.email)}
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
        }
        triggerValidation
      >
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
              value={applicantPhoneNumber}
              error={hasError('applicant.phoneNumber')}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      <ReviewGroup
        isEditable={editable && isPrimaryParent}
        canCloseEdit={groupHasNoErrors([
          'otherParent',
          'otherParentName',
          'otherParentId',
          'otherParentEmail',
        ])}
        editChildren={
          <>
            <Label marginBottom={3}>
              {formatMessage(parentalLeaveFormMessages.shared.otherParentTitle)}
            </Label>

            <RadioController
              id="otherParent"
              name="otherParent"
              defaultValue={otherParent}
              options={otherParentOptions.map((option) => ({
                ...option,
                label: formatAndParseAsHTML(
                  option.label,
                  application,
                  formatMessage,
                ),
              }))}
              onSelect={(s: string) => {
                setStateful((prev) => ({
                  ...prev,
                  otherParent: s as ValidOtherParentAnswer,
                }))
              }}
              error={hasError('otherParent')}
            />

            {otherParent === MANUAL && (
              <>
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                    <InputController
                      id="otherParentName"
                      name="otherParentName"
                      defaultValue={otherParentName}
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.otherParentName,
                      )}
                      onChange={(e) =>
                        setStateful((prev) => ({
                          ...prev,
                          otherParentName: e.target.value,
                        }))
                      }
                      error={hasError('otherParentName')}
                    />
                  </GridColumn>

                  <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
                    <InputController
                      id="otherParentId"
                      name="otherParentId"
                      defaultValue={otherParentId}
                      format="######-####"
                      placeholder="000000-0000"
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.otherParentID,
                      )}
                      onChange={(e) =>
                        setStateful((prev) => ({
                          ...prev,
                          otherParentId: e.target.value?.replace('-', ''),
                        }))
                      }
                      error={hasError('otherParentId')}
                    />
                  </GridColumn>
                </GridRow>

                {otherParentWillApprove && (
                  <Box paddingTop={2}>
                    <InputController
                      id="otherParentEmail"
                      name="otherParentEmail"
                      defaultValue={otherParentEmail}
                      type="email"
                      label={formatMessage(
                        parentalLeaveFormMessages.shared
                          .otherParentEmailSubSection,
                      )}
                      onChange={(e) =>
                        setStateful((prev) => ({
                          ...prev,
                          otherParentEmail: e.target.value,
                        }))
                      }
                      error={hasError('otherParentEmail')}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        }
        triggerValidation
      >
        {otherParent === NO && (
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.shared.otherParentTitle,
            )}
            value={otherParent}
          />
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
              {otherParentWillApprove && (
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentEmailSubSection,
                  )}
                  value={otherParentEmail}
                />
              )}
            </GridColumn>

            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentID,
                )}
                value={otherParentId}
              />
            </GridColumn>
          </GridRow>
        )}
      </ReviewGroup>

      <ReviewGroup
        isEditable={editable}
        canCloseEdit={groupHasNoErrors([
          'payments.bank',
          'payments.pensionFund',
          'payments.union',
          'usePrivatePensionFund',
          'payments.privatePensionFund',
        ])}
        editChildren={
          <>
            <Label marginBottom={3}>
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

            <GridRow marginTop={3} marginBottom={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
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
              </GridColumn>

              <GridColumn
                paddingTop={[2, 2, 2, 0]}
                span={['12/12', '12/12', '12/12', '6/12']}
              >
                <SelectController
                  label={formatMessage(parentalLeaveFormMessages.shared.union)}
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
                  error={hasError('payments.union')}
                />
              </GridColumn>
            </GridRow>

            <Label marginBottom={3}>
              {formatMessage(
                parentalLeaveFormMessages.shared.privatePensionFundName,
              )}
            </Label>

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
                setStateful((prev) => ({
                  ...prev,
                  usePrivatePensionFund: s as YesOrNo,
                }))
              }}
              error={hasError('usePrivatePensionFund')}
            />

            {usePrivatePensionFund === YES && (
              <GridRow marginTop={1}>
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
                    error={hasError('payments.privatePensionFund')}
                  />
                </GridColumn>

                <GridColumn
                  paddingTop={[2, 2, 2, 0]}
                  span={['12/12', '12/12', '12/12', '6/12']}
                >
                  <SelectController
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFundRatio,
                    )}
                    name="payments.union"
                    id="payments.union"
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
                    error={hasError('payments.union')}
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        }
        triggerValidation
      >
        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationBank,
              )}
              value={bank}
            />
          </GridColumn>
        </GridRow>

        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.salaryLabelPensionFund,
              )}
              value={getSelectOptionLabel(pensionFundOptions, pensionFund)}
            />
          </GridColumn>

          <GridColumn
            paddingTop={[2, 2, 2, 0]}
            span={['12/12', '12/12', '12/12', '5/12']}
          >
            <DataValue
              label={formatMessage(parentalLeaveFormMessages.shared.union)}
              value={getSelectOptionLabel(unionOptions, union)}
            />
          </GridColumn>
        </GridRow>

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
          <GridRow marginTop={2}>
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
      </ReviewGroup>

      {isPrimaryParent && (
        <ReviewGroup
          isEditable={editable}
          canCloseEdit={groupHasNoErrors([
            'usePersonalAllowance',
            'personalAllowance.useAsMuchAsPossible',
            'personalAllowance.usage',
          ])}
          editChildren={
            <>
              <Label marginBottom={2}>
                {formatMessage(
                  parentalLeaveFormMessages.personalAllowance.title,
                )}
              </Label>

              <RadioController
                id="usePersonalAllowance"
                name="usePersonalAllowance"
                defaultValue={usePersonalAllowance}
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
                  setStateful((prev) => ({
                    ...prev,
                    usePersonalAllowance: s as YesOrNo,
                  }))
                }}
                error={hasError('usePersonalAllowance')}
              />

              {usePersonalAllowance === YES && (
                <>
                  <Label marginTop={2} marginBottom={2}>
                    {formatMessage(
                      parentalLeaveFormMessages.personalAllowance
                        .useAsMuchAsPossible,
                    )}
                  </Label>

                  <RadioController
                    id="personalAllowance.useAsMuchAsPossible"
                    name="personalAllowance.useAsMuchAsPossible"
                    defaultValue={personalUseAsMuchAsPossible}
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
                      setStateful((prev) => ({
                        ...prev,
                        personalUseAsMuchAsPossible: s as YesOrNo,
                      }))
                    }}
                    error={hasError('personalAllowance.useAsMuchAsPossible')}
                  />
                </>
              )}

              {personalUseAsMuchAsPossible === NO && (
                <>
                  <Label marginTop={2} marginBottom={2}>
                    {formatMessage(
                      parentalLeaveFormMessages.personalAllowance.manual,
                    )}
                  </Label>

                  <InputController
                    id="personalAllowance.usage"
                    name="personalAllowance.usage"
                    suffix="%"
                    placeholder="0%"
                    type="number"
                    defaultValue={personalUsage}
                    onChange={(e) =>
                      setStateful((prev) => ({
                        ...prev,
                        personalUsage: e.target.value?.replace('%', ''),
                      }))
                    }
                    error={hasError('personalAllowance.usage')}
                  />
                </>
              )}
            </>
          }
          triggerValidation
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

            {usePersonalAllowance === YES &&
              personalUseAsMuchAsPossible === YES && (
                <GridColumn
                  paddingTop={[2, 2, 2, 0]}
                  span={['12/12', '12/12', '12/12', '5/12']}
                >
                  <RadioValue
                    label={formatMessage(
                      parentalLeaveFormMessages.reviewScreen
                        .usePersonalAllowance,
                    )}
                    value={personalUseAsMuchAsPossible}
                  />
                </GridColumn>
              )}

            {usePersonalAllowance === YES &&
              personalUseAsMuchAsPossible === NO && (
                <GridColumn
                  paddingTop={[2, 2, 2, 0]}
                  span={['12/12', '12/12', '12/12', '5/12']}
                >
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.personalAllowance
                        .allowanceUsage,
                    )}
                    value={`${personalUsage ?? 0}%`}
                  />
                </GridColumn>
              )}
          </GridRow>
        </ReviewGroup>
      )}

      {isPrimaryParent && (
        <ReviewGroup
          isEditable={editable}
          canCloseEdit={groupHasNoErrors([
            'usePersonalAllowanceFromSpouse',
            'personalAllowance.useAsMuchAsPossibleFromSpouse',
            'personalAllowanceFromSpouse.usage',
          ])}
          editChildren={
            <>
              <Label marginBottom={2}>
                {formatMessage(
                  parentalLeaveFormMessages.personalAllowance.spouseTitle,
                )}
              </Label>

              <RadioController
                id="usePersonalAllowanceFromSpouse"
                name="usePersonalAllowanceFromSpouse"
                defaultValue={usePersonalAllowanceFromSpouse}
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
                  setStateful((prev) => ({
                    ...prev,
                    usePersonalAllowanceFromSpouse: s as YesOrNo,
                  }))
                }}
                error={hasError('usePersonalAllowanceFromSpouse')}
              />

              {usePersonalAllowanceFromSpouse === YES && (
                <>
                  <Label marginTop={2} marginBottom={2}>
                    {formatMessage(
                      parentalLeaveFormMessages.personalAllowance
                        .useAsMuchAsPossibleFromSpouse,
                    )}
                  </Label>

                  <RadioController
                    id="personalAllowance.useAsMuchAsPossibleFromSpouse"
                    name="personalAllowance.useAsMuchAsPossibleFromSpouse"
                    defaultValue={spouseUseAsMuchAsPossible}
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
                      setStateful((prev) => ({
                        ...prev,
                        spouseUseAsMuchAsPossible: s as YesOrNo,
                      }))
                    }}
                    error={hasError(
                      'personalAllowance.useAsMuchAsPossibleFromSpouse',
                    )}
                  />
                </>
              )}

              {spouseUseAsMuchAsPossible === NO && (
                <>
                  <Label marginTop={2} marginBottom={2}>
                    {formatMessage(
                      parentalLeaveFormMessages.personalAllowance.manual,
                    )}
                  </Label>

                  <InputController
                    id="personalAllowanceFromSpouse.usage"
                    name="personalAllowanceFromSpouse.usage"
                    suffix="%"
                    placeholder="0%"
                    type="number"
                    defaultValue={spouseUsage}
                    onChange={(e) =>
                      setStateful((prev) => ({
                        ...prev,
                        spouseUsage: e.target.value?.replace('%', ''),
                      }))
                    }
                    error={hasError('personalAllowanceFromSpouse.usage')}
                  />
                </>
              )}
            </>
          }
          triggerValidation
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

      <ReviewGroup
        isEditable={editable}
        canCloseEdit={groupHasNoErrors([
          'employer.isSelfEmployed',
          'employer.email',
        ])}
        editChildren={
          <>
            <Label marginBottom={3}>
              {formatMessage(parentalLeaveFormMessages.selfEmployed.title)}
            </Label>

            <RadioController
              id="employer.isSelfEmployed"
              name="employer.isSelfEmployed"
              defaultValue={isSelfEmployed}
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
              onSelect={(s: string) =>
                setStateful((prev) => ({
                  ...prev,
                  isSelfEmployed: s as YesOrNo,
                }))
              }
              error={hasError('employer.isSelfEmployed')}
            />

            {isSelfEmployed === NO && (
              <InputController
                id="employer.email"
                name="employer.email"
                label={formatMessage(parentalLeaveFormMessages.employer.email)}
                defaultValue={employerEmail}
                onChange={(e) =>
                  setStateful((prev) => ({
                    ...prev,
                    employerEmail: e.target.value,
                  }))
                }
                error={hasError('employer.email')}
              />
            )}
          </>
        }
        triggerValidation
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.selfEmployed.title,
              )}
              value={isSelfEmployed}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            {isSelfEmployed === NO && (
              <DataValue
                label={formatMessage(parentalLeaveFormMessages.employer.email)}
                value={employerEmail}
              />
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      <ReviewGroup>
        <SummaryRights application={application} />
      </ReviewGroup>

      <ReviewGroup
        isEditable={editable}
        editAction={() => goToScreen?.('periods')}
        isLast={true}
      >
        <SummaryTimeline application={application} />
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
