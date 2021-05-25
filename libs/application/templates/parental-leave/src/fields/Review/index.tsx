import React, { FC, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Application,
  getValueViaPath,
  formatAndParseAsHTML,
  buildFieldOptions,
  RecordObject,
  Field,
} from '@island.is/application/core'
import { GridColumn, GridRow, Input } from '@island.is/island-ui/core'
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
} from '../../parentalLeaveUtils'
// TODO: Bring back payment calculation info, once we have an api
// import PaymentsTable from '../PaymentSchedule/PaymentsTable'
// import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO, MANUAL } from '../../constants'
import { Period } from '../../types'
import { SummaryTimeline } from '../components/Timeline/SummaryTimeline'
import { SummaryRights } from '../Rights/SummaryRights'
import {
  useApplicationAnswers,
  Boolean,
} from '../../hooks/use-application-answers'
import { useUnion } from '../../hooks/use-union'
import { usePrivatePensionFund } from '../../hooks/use-private-pension-fund'
import { usePensionFund } from '../../hooks/use-pension-fund'

type ValidOtherParentAnswer = typeof NO | typeof MANUAL | undefined

interface ReviewScreenProps {
  application: Application
  field: Field
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}

type selectOption = {
  label: string
  value: string
}

const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  errors,
  editable,
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  const {
    otherParent,
    privatePensionFund,
    isSelfEmployed,
    otherParentName,
    otherParentId,
    bank,
    personalAllowance,
    personalAllowanceFromSpouse,
    personalUseAsMuchAsPossible,
    personalUsage,
    spouseUseAsMuchAsPossible,
    spouseUsage,
    employerEmail,
  } = useApplicationAnswers(application)
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const isPrimaryParent = selectedChild?.parentalRelation === 'primary'
  const pensionFundOptions = usePensionFund()
  const privatePensionFundOptions = usePrivatePensionFund()
  const unionOptions = useUnion()

  const getSelectOptionLabel = (options: selectOption[], key: string) =>
    options.find(
      (option) =>
        option.value === (getValueViaPath(application.answers, key) as string),
    )?.label

  const otherParentOptions = useMemo(
    () =>
      buildFieldOptions(getOtherParentOptions(application), application, field),
    [application],
  )

  const [
    statefulOtherParentConfirmed,
    setStatefulOtherParentConfirmed,
  ] = useState(otherParent)
  const [statefulOtherParentName, setStatefulOtherParentName] = useState(
    otherParentName,
  )
  const [statefulOtherParentId, setStatefulOtherParentId] = useState(
    otherParentId,
  )
  const [statefulPrivatePension, setStatefulPrivatePension] = useState(
    privatePensionFund,
  )
  const [statefulSelfEmployed, setStatefulSelfEmployed] = useState(
    isSelfEmployed,
  )
  const [statefulPersonalAllowance, setStatefulPersonalAllowance] = useState(
    personalAllowance,
  )
  const [
    statefulPersonalUseAsMuchAsPossible,
    setStatefulPersonalUseAsMuchAsPossible,
  ] = useState(personalUseAsMuchAsPossible)
  const [statefulPersonalUsage, setStatefulPersonalUsage] = useState(
    personalUsage,
  )
  const [
    statefulSpousePersonalAllowance,
    setStatefulSpousePersonalAllowance,
  ] = useState(personalAllowanceFromSpouse)
  const [
    statefulSpouseUseAsMuchAsPossible,
    setStatefulSpouseUseAsMuchAsPossible,
  ] = useState(spouseUseAsMuchAsPossible)
  const [statefulSpouseUsage, setStatefulSpouseUsage] = useState(spouseUsage)

  /* TODO: Bring back payment calculation info, once we have an api
  https://app.asana.com/0/1182378413629561/1200214178491335/f
  */
  // const dob = getExpectedDateOfBirth(application)
  // const { data, error, loading } = useQuery(getEstimatedPayments, {
  //   variables: {
  //     input: {
  //       dateOfBirth: dob,
  //       period: [
  //         {
  //           from: '2021-01-01',
  //           to: '2021-01-01',
  //           ratio: 100,
  //           approved: true,
  //           paid: true,
  //         },
  //       ],
  //     },
  //   },
  // })

  return (
    <>
      <ReviewGroup
        isEditable={editable && isPrimaryParent}
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
                setStatefulOtherParentConfirmed(s as ValidOtherParentAnswer)
              }}
            />

            {statefulOtherParentConfirmed === MANUAL && (
              <>
                <GridRow>
                  <GridColumn span="6/12">
                    <InputController
                      id="otherParentName"
                      name="otherParentName"
                      defaultValue={statefulOtherParentName}
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.otherParentName,
                      )}
                      onChange={(e) =>
                        setStatefulOtherParentName(e.target.value)
                      }
                    />
                  </GridColumn>

                  <GridColumn span="6/12">
                    <InputController
                      id="otherParentId"
                      name="otherParentId"
                      defaultValue={statefulOtherParentId}
                      format="######-####"
                      placeholder="000000-0000"
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.otherParentID,
                      )}
                      onChange={(e) =>
                        setStatefulOtherParentId(
                          e.target.value?.replace('-', ''),
                        )
                      }
                    />
                  </GridColumn>
                </GridRow>
              </>
            )}
          </>
        }
      >
        {statefulOtherParentConfirmed === NO && (
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.shared.otherParentTitle,
            )}
            value={statefulOtherParentConfirmed}
          />
        )}

        {statefulOtherParentConfirmed === MANUAL && (
          <>
            <GridRow>
              <GridColumn span="5/12">
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentName,
                  )}
                  value={statefulOtherParentName}
                />
              </GridColumn>

              <GridColumn span="5/12">
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentID,
                  )}
                  value={statefulOtherParentId}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </ReviewGroup>

      <ReviewGroup
        isEditable={editable}
        editChildren={
          <>
            <Label marginBottom={3}>
              {formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationSubSection,
              )}
            </Label>

            <Input
              id="payments.bank"
              name="payments.bank"
              label={formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationBank,
              )}
              ref={register}
            />

            <GridRow marginTop={3} marginBottom={3}>
              <GridColumn span="6/12">
                <SelectController
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                  )}
                  name="payments.pensionFund"
                  id="payments.pensionFund"
                  options={pensionFundOptions}
                />
              </GridColumn>

              <GridColumn span="6/12">
                <SelectController
                  label={formatMessage(parentalLeaveFormMessages.shared.union)}
                  name="payments.union"
                  id="payments.union"
                  options={unionOptions}
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
              defaultValue={privatePensionFund}
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
                setStatefulPrivatePension(s as Boolean)
              }}
            />

            {statefulPrivatePension === YES && (
              <GridRow marginTop={1}>
                <GridColumn span="6/12">
                  <SelectController
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFund,
                    )}
                    name="payments.pensionFund"
                    id="payments.pensionFund"
                    options={privatePensionFundOptions}
                  />
                </GridColumn>

                <GridColumn span="6/12">
                  <SelectController
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.union,
                    )}
                    name="payments.union"
                    id="payments.union"
                    options={unionOptions}
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        }
      >
        <GridRow marginBottom={2}>
          <GridColumn span="5/12">
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationBank,
              )}
              value={bank}
            />
          </GridColumn>
        </GridRow>

        <GridRow marginBottom={2}>
          <GridColumn span="5/12">
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.salaryLabelPensionFund,
              )}
              value={
                getSelectOptionLabel(
                  pensionFundOptions,
                  'payments.pensionFund',
                ) as string
              }
            />
          </GridColumn>

          <GridColumn span="5/12">
            <DataValue
              label={formatMessage(parentalLeaveFormMessages.shared.union)}
              value={
                getSelectOptionLabel(unionOptions, 'payments.union') as string
              }
            />
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn span="5/12">
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.privatePensionFundName,
              )}
              value={privatePensionFund}
            />
          </GridColumn>
        </GridRow>

        {statefulPrivatePension === YES && (
          <GridRow>
            <GridColumn span="6/12">
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.privatePensionFund,
                )}
                value={
                  getSelectOptionLabel(
                    privatePensionFundOptions,
                    'payments.pensionFund',
                  ) as string
                }
              />
            </GridColumn>

            <GridColumn span="6/12">
              <DataValue
                label={formatMessage(parentalLeaveFormMessages.shared.union)}
                value={
                  getSelectOptionLabel(unionOptions, 'payments.union') as string
                }
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
              defaultValue={statefulPersonalAllowance}
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
                setStatefulPersonalAllowance(s as Boolean)
              }}
            />

            {statefulPersonalAllowance === YES && (
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
                  defaultValue={statefulPersonalUseAsMuchAsPossible}
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
                    setStatefulPersonalUseAsMuchAsPossible(s as Boolean)
                  }}
                />
              </>
            )}

            {statefulPersonalUseAsMuchAsPossible === NO && (
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
                  defaultValue={statefulPersonalUsage}
                  onChange={(e) =>
                    setStatefulPersonalUsage(e.target.value?.replace('%', ''))
                  }
                />
              </>
            )}
          </>
        }
      >
        <GridRow marginBottom={2}>
          <GridColumn span="5/12">
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.title,
              )}
              value={statefulPersonalAllowance}
            />
          </GridColumn>

          {statefulPersonalAllowance === YES &&
            statefulPersonalUseAsMuchAsPossible === YES && (
              <GridColumn span="5/12">
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.reviewScreen.usePersonalAllowance,
                  )}
                  value={statefulPersonalUseAsMuchAsPossible}
                />
              </GridColumn>
            )}

          {statefulPersonalAllowance === YES &&
            statefulPersonalUseAsMuchAsPossible === NO && (
              <GridColumn span="5/12">
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                  )}
                  value={`${statefulPersonalUsage ?? 0}%`}
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
              defaultValue={statefulSpousePersonalAllowance}
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
                setStatefulSpousePersonalAllowance(s as Boolean)
              }}
            />

            {statefulSpousePersonalAllowance === YES && (
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
                  defaultValue={statefulSpouseUseAsMuchAsPossible}
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
                    setStatefulSpouseUseAsMuchAsPossible(s as Boolean)
                  }}
                />
              </>
            )}

            {statefulSpouseUseAsMuchAsPossible === NO && (
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
                  defaultValue={statefulSpouseUsage}
                  onChange={(e) =>
                    setStatefulSpouseUsage(e.target.value?.replace('%', ''))
                  }
                />
              </>
            )}
          </>
        }
      >
        <GridRow marginBottom={2}>
          <GridColumn span="5/12">
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.spouseTitle,
              )}
              value={statefulSpousePersonalAllowance}
            />
          </GridColumn>

          {statefulSpousePersonalAllowance === YES &&
            statefulSpouseUseAsMuchAsPossible === YES && (
              <GridColumn span="5/12">
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.reviewScreen
                      .useSpousePersonalAllowance,
                  )}
                  value={statefulSpouseUseAsMuchAsPossible}
                />
              </GridColumn>
            )}

          {statefulSpousePersonalAllowance === YES &&
            statefulSpouseUseAsMuchAsPossible === NO && (
              <GridColumn span="5/12">
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                  )}
                  value={`${statefulSpouseUsage ?? 0}%`}
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
              onSelect={(s: string) => {
                setStatefulSelfEmployed(s as Boolean)
              }}
            />

            {statefulSelfEmployed === NO && (
              <Input
                id="employer.email"
                name="employer.email"
                label={formatMessage(parentalLeaveFormMessages.employer.email)}
                ref={register({
                  required: statefulSelfEmployed === NO,
                })}
              />
            )}
          </>
        }
      >
        <GridRow>
          <GridColumn span="5/12">
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.selfEmployed.title,
              )}
              value={isSelfEmployed}
            />
          </GridColumn>

          <GridColumn span="5/12">
            {statefulSelfEmployed === NO && (
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
        {/* TODO: add otherParentPeriods once available */}
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

export default Review
