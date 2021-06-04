import React, { FC } from 'react'

import { Application, RecordObject, Field } from '@island.is/application/core'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO, MANUAL } from '../../constants'
import { Boolean } from '../../hooks/useApplicationAnswers'
import { useUnion as useUnionOptions } from '../../hooks/useUnion'
import { usePensionFund as usePensionFundOptions } from '../../hooks/usePensionFund'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'

interface ScreenProps {
  application: Application
  field: Field
  errors?: RecordObject
}

type selectOption = {
  label: string
  value: string
}

const EmployerApprovalExtraInformation: FC<ScreenProps> = ({ application }) => {
  const pensionFundOptions = usePensionFundOptions()
  const unionOptions = useUnionOptions()
  const { formatMessage } = useLocale()
  const [{ pensionFund, union }, setStateful] = useStatefulAnswers(application)

  const getSelectOptionLabel = (options: selectOption[], id: string) =>
    options.find((option) => option.value === id)?.label

  return (
    <>
      <Box>
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
              label={formatMessage(
                parentalLeaveFormMessages.shared.salaryLabelUnion,
              )}
              value={getSelectOptionLabel(unionOptions, union)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      {/* 
      <ReviewGroup
        isEditable={editable}
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
                  usePrivatePensionFund: s as Boolean,
                }))
              }}
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
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        }
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

      <ReviewGroup
        isEditable={editable}
        editChildren={
          <>
            <Label marginBottom={2}>
              {formatMessage(parentalLeaveFormMessages.personalAllowance.title)}
            </Label>

            <RadioController
              id="usePersonalAllowance"
              name="usePersonalAllowance"
              defaultValue={personalAllowance}
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
                  personalAllowance: s as Boolean,
                }))
              }}
            />

            {personalAllowance === YES && (
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
                      personalUseAsMuchAsPossible: s as Boolean,
                    }))
                  }}
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
                />
              </>
            )}
          </>
        }
      >
        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.title,
              )}
              value={personalAllowance}
            />
          </GridColumn>

          {personalAllowance === YES && personalUseAsMuchAsPossible === YES && (
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

          {personalAllowance === YES && personalUseAsMuchAsPossible === NO && (
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

      <ReviewGroup
        isEditable={editable}
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
              defaultValue={personalAllowanceFromSpouse}
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
                  personalAllowanceFromSpouse: s as Boolean,
                }))
              }}
            />

            {personalAllowanceFromSpouse === YES && (
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
                      spouseUseAsMuchAsPossible: s as Boolean,
                    }))
                  }}
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
                />
              </>
            )}
          </>
        }
      >
        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.spouseTitle,
              )}
              value={personalAllowanceFromSpouse}
            />
          </GridColumn>

          {personalAllowanceFromSpouse === YES &&
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

          {personalAllowanceFromSpouse === YES &&
            spouseUseAsMuchAsPossible === NO && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                  )}
                  value={`${spouseUsage ?? 0}%`}
                />
              </GridColumn>
            )}
        </GridRow>
      </ReviewGroup>

      <ReviewGroup
        isEditable={editable}
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
                  isSelfEmployed: s as Boolean,
                }))
              }
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
              />
            )}
          </>
        }
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

       */}
    </>
  )
}

export default EmployerApprovalExtraInformation
