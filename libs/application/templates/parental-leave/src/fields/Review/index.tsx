import React, { FC, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Application,
  getValueViaPath,
  ValidAnswers,
  formatAndParseAsHTML,
  buildFieldOptions,
  RecordObject,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'

import Timeline from '../components/Timeline'
import {
  formatPeriods,
  getExpectedDateOfBirth,
  getOtherParentOptions,
} from '../../parentalLeaveUtils'

// TODO: Bring back payment calculation info, once we have an api
// import PaymentsTable from '../PaymentSchedule/PaymentsTable'
// import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'

import YourRightsBoxChart from '../Rights/YourRightsBoxChart'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO } from '../../constants'
import {
  GetPensionFunds,
  GetPrivatePensionFunds,
  GetUnions,
} from '../../graphql/queries'
import {
  GetPensionFundsQuery,
  GetPrivatePensionFundsQuery,
  GetUnionsQuery,
} from '../../types/schema'
import { Period } from '../../types'

type ValidOtherParentAnswer = 'no' | 'manual' | undefined

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
  editable?: boolean
  errors?: RecordObject
}

const Review: FC<ReviewScreenProps> = ({
  application,
  goToScreen,
  editable = true,
  errors,
}) => {
  const [allItemsExpanded, toggleAllItemsExpanded] = useState(true)
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const [
    statefulOtherParentConfirmed,
    setStatefulOtherParentConfirmed,
  ] = useState<ValidOtherParentAnswer>(
    getValueViaPath(
      application.answers,
      'otherParent',
    ) as ValidOtherParentAnswer,
  )

  const [
    statefulPrivatePension,
    setStatefulPrivatePension,
  ] = useState<ValidAnswers>(
    getValueViaPath(
      application.answers,
      'usePrivatePensionFund',
    ) as ValidAnswers,
  )

  const otherParentOptions = useMemo(
    () => buildFieldOptions(getOtherParentOptions(application), application),
    [application],
  )

  const { data: pensionFundData } = useQuery<GetPensionFundsQuery>(
    GetPensionFunds,
  )
  const pensionFundOptions =
    pensionFundData?.getPensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []

  const {
    data: privatePensionFundData,
  } = useQuery<GetPrivatePensionFundsQuery>(GetPrivatePensionFunds)
  const privatePensionFundOptions =
    privatePensionFundData?.getPrivatePensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []

  const { data: unionData } = useQuery<GetUnionsQuery>(GetUnions)
  const unionOptions =
    unionData?.getUnions?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []

  const dob = getExpectedDateOfBirth(application)

  /* TODO: Bring back payment calculation info, once we have an api
     https://app.asana.com/0/1182378413629561/1200214178491335/f
  */
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

  if (!dob) {
    return null
  }
  const dobDate = new Date(dob)

  return (
    <div>
      <Box marginTop={[2, 2, 4]} marginBottom={[0, 0, 6]}>
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            colorScheme="default"
            iconType="filled"
            icon={allItemsExpanded ? 'remove' : 'add'}
            onClick={() => {
              toggleAllItemsExpanded(!allItemsExpanded)
            }}
            preTextIconType="filled"
            size="default"
            type="button"
            variant="utility"
          >
            {allItemsExpanded
              ? `${formatMessage(
                  parentalLeaveFormMessages.confirmation.collapseAll,
                )}`
              : `${formatMessage(
                  parentalLeaveFormMessages.confirmation.epxandAll,
                )}`}
          </Button>
        </Box>

        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_4"
            label={formatMessage(
              parentalLeaveFormMessages.shared.otherParentTitle,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Box>
                {editable ? (
                  <RadioController
                    id="otherParent"
                    disabled={false}
                    name="otherParent"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'otherParent',
                      ) as string[]
                    }
                    options={otherParentOptions.map((option) => ({
                      ...option,
                      label: formatAndParseAsHTML(
                        option.label,
                        application,
                        formatMessage,
                      ),
                    }))}
                    onSelect={(s: string) => {
                      setStatefulOtherParentConfirmed(
                        s as ValidOtherParentAnswer,
                      )
                    }}
                  />
                ) : (
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'otherParent',
                      ) as string[]
                    }
                  </Text>
                )}
              </Box>
              {statefulOtherParentConfirmed === 'manual' && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      {editable ? (
                        <Input
                          id="otherParentName"
                          name="otherParentName"
                          label={formatMessage(
                            parentalLeaveFormMessages.shared.otherParentName,
                          )}
                          ref={register}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'otherParentName',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                    <GridColumn span="6/12">
                      {editable ? (
                        <Input
                          id="otherParentId"
                          name="otherParentId"
                          label={formatMessage(
                            parentalLeaveFormMessages.shared.otherParentID,
                          )}
                          ref={register}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'otherParentId',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_3"
            label={formatMessage(
              parentalLeaveFormMessages.shared.paymentInformationSubSection,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  {editable ? (
                    <Input
                      id="payments.bank"
                      name="payments.bank"
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.paymentInformationBank,
                      )}
                      ref={register}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.bank',
                        ) as string[]
                      }
                    </Text>
                  )}
                </GridColumn>
                <GridColumn span="6/12">
                  {
                    //TODO add the personal allowance questions when finished
                  }
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  {editable ? (
                    <SelectController
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                      )}
                      name="payments.pensionFund"
                      disabled={false}
                      id="payments.pensionFund"
                      options={pensionFundOptions}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.pensionFund',
                        ) as string[]
                      }
                    </Text>
                  )}
                </GridColumn>
                <GridColumn span="6/12">
                  {editable ? (
                    <SelectController
                      label={formatMessage(
                        parentalLeaveFormMessages.shared.union,
                      )}
                      name="payments.union"
                      disabled={false}
                      id="payments.union"
                      options={unionOptions}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.union',
                        ) as string[]
                      }
                    </Text>
                  )}
                </GridColumn>
              </GridRow>

              <Box marginTop={3} />

              <Text variant="h5" marginTop={1} marginBottom={2}>
                {formatMessage(
                  parentalLeaveFormMessages.shared.privatePensionFundName,
                )}
              </Text>

              {editable ? (
                <RadioController
                  id="usePrivatePensionFund"
                  disabled={false}
                  name="usePrivatePensionFund"
                  defaultValue={
                    getValueViaPath(
                      application.answers,
                      'usePrivatePensionFund',
                    ) as string[]
                  }
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
                    setStatefulPrivatePension(s as ValidAnswers)
                  }}
                />
              ) : (
                <Text>
                  {
                    getValueViaPath(
                      application.answers,
                      'usePrivatePensionFund',
                    ) as string[]
                  }
                </Text>
              )}

              {statefulPrivatePension === YES && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      {editable ? (
                        <SelectController
                          label={formatMessage(
                            parentalLeaveFormMessages.shared.privatePensionFund,
                          )}
                          name="payments.pensionFund"
                          disabled={false}
                          id="payments.pensionFund"
                          options={privatePensionFundOptions}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'payments.pensionFund',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                    <GridColumn span="6/12">
                      {editable ? (
                        <SelectController
                          label={formatMessage(
                            parentalLeaveFormMessages.shared.union,
                          )}
                          name="payments.union"
                          disabled={false}
                          id="payments.union"
                          options={unionOptions}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'payments.union',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>
          <AccordionItem
            id="id_1"
            label={formatMessage(parentalLeaveFormMessages.employer.subSection)}
            startExpanded={allItemsExpanded}
          >
            {editable ? (
              <Box paddingY={4}>
                <Input
                  id="employer.email"
                  name="employer.email"
                  label={formatMessage(
                    parentalLeaveFormMessages.employer.email,
                  )}
                  ref={register}
                />
              </Box>
            ) : (
              <Text paddingY={4}>
                {
                  getValueViaPath(
                    application.answers,
                    'employer.email',
                  ) as string[]
                }
              </Text>
            )}
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(parentalLeaveFormMessages.shared.yourRights)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <YourRightsBoxChart application={application} />
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(
              parentalLeaveFormMessages.shared.periodsSection,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Timeline
                initDate={dobDate}
                title={formatMessage(
                  parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
                )}
                titleSmall={formatMessage(
                  parentalLeaveFormMessages.shared.dateOfBirthTitle,
                )}
                // TODO: Once we have the data, add the otherParentPeriods here.
                //  periods={formatPeriods(
                //   application.answers.periods as Period[],
                //   otherParentPeriods,
                // )}
                periods={formatPeriods(application.answers.periods as Period[])}
              />
              {editable && (
                <Box paddingTop={3}>
                  <Button size="small" onClick={() => goToScreen?.('periods')}>
                    {formatMessage(parentalLeaveFormMessages.leavePlan.change)}
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionItem>

          {/* TODO: Bring back payment calculation info, once we have an api
              https://app.asana.com/0/1182378413629561/1200214178491335/f
          */}
          {/* <AccordionItem
            id="id_4"
            label={formatMessage(
              parentalLeaveFormMessages.paymentPlan.subSection,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              {!loading && !error && (
                <PaymentsTable
                  application={application}
                  payments={data.getEstimatedPayments}
                />
              )}
            </Box>
          </AccordionItem> */}

          <AccordionItem
            id="id_4"
            label={formatMessage(
              parentalLeaveFormMessages.shareInformation.subSection,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Box marginTop={1} marginBottom={2}>
                <Text variant="h5">
                  {formatMessage(
                    parentalLeaveFormMessages.shareInformation.title,
                  )}
                </Text>
              </Box>

              {editable ? (
                <RadioController
                  id="shareInformationWithOtherParent"
                  disabled={false}
                  name="shareInformationWithOtherParent"
                  error={
                    (errors as RecordObject<string> | undefined)
                      ?.shareInformationWithOtherParent
                  }
                  defaultValue={
                    getValueViaPath(
                      application.answers,
                      'shareInformationWithOtherParent',
                    ) as string[]
                  }
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
                <Text>
                  {
                    getValueViaPath(
                      application.answers,
                      'shareInformationWithOtherParent',
                    ) as string[]
                  }
                </Text>
              )}
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
